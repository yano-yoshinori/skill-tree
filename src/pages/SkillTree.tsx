import React, { Component } from 'react'

import data from '../data'
import { buildSkillTree } from '../services/SkillTree'

let baseId = 10000

type State = {
  items: any[]
  checkedItems: any[]
  canEdit: boolean
  status: string
  renameTargetUid: string
}

export default class SkillTree extends Component {
  inputRefs: any = {}

  state: State = {
    items: [],
    checkedItems: [],
    canEdit: false,
    status: '',
    renameTargetUid: '',
  }

  componentDidMount() {
    this.setState({ items: data })
  }

  onKeyPressAddItem(e: any, uid: string, parentId: number) {
    if (e.key !== 'Enter') return

    const { items } = this.state

    // TODO サーバーに投げる

    // 重複チェック。同じ親に同じ名称は登録できない
    const name = this.inputRefs[uid].value
    const found = items.find((item: any) => item.parentId === parentId && item.name === name)

    if (found) {
      this.setState({ status: '重複しています' })
      return
    }

    baseId += 1

    this.setState({
      status: '',
      items: items.concat({
        id: baseId,
        name,
        parentId,
      }),
    })

    this.inputRefs[uid].value = ''
  }

  onKeyPressRename(e: any, uid: string, parentId: number) {
    if (e.key !== 'Enter') return

    const { value } = e.target
    const { items } = this.state

    const foundIndex = items.findIndex((item) => `${item.parentId}-${item.id}` === uid)
    const foundItem = items[foundIndex]

    items[foundIndex] = {
      id: foundItem.id,
      name: value,
      parentId: foundItem.parentId,
    }

    this.setState({ items, renameTargetUid: '', checkedItems: [] })
  }

  onClickEdit = () => {
    const { canEdit } = this.state
    this.setState({ canEdit: !canEdit })
  }

  onClickDelete = () => {
    const { items, checkedItems } = this.state

    this.setState({
      items: items.filter((item) => {
        return !checkedItems.includes(item.uid)
      }),
      checkedItems: [],
    })
  }

  onClickRename = () => {
    const { checkedItems, renameTargetUid } = this.state

    this.setState({ renameTargetUid: renameTargetUid ? '' : checkedItems[0] })
  }

  onChangeCheckItem = (e: any, uid: string) => {
    const { checkedItems } = this.state
    const { checked } = e.target

    const newCheckedItems = checked
      ? checkedItems.concat(uid)
      : checkedItems.filter((item) => item !== uid)

    this.setState({
      checkedItems: newCheckedItems,
    })
  }

  recurse(children: any[]) {
    const { canEdit, renameTargetUid, checkedItems } = this.state
    console.log(renameTargetUid)
    return children.map((child) => {
      const uid = `${child.parentId}-${child.id}`
      return (
        <div
          key={uid}
          style={{
            marginLeft: 20,
            borderLeft: canEdit ? '1px solid #CCC' : 'none',
          }}
        >
          {canEdit ? (
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                onChange={(e) => this.onChangeCheckItem(e, uid)}
                checked={checkedItems.includes(uid)}
              />
              {uid === renameTargetUid ? (
                <input
                  type="text"
                  defaultValue={child.name}
                  onKeyPress={(e) => this.onKeyPressRename(e, uid, child.id)}
                />
              ) : (
                <span>{child.name}</span>
              )}
            </label>
          ) : (
            <div>{child.name}</div>
          )}

          {this.recurse(child.children)}
          {canEdit && (
            <div style={{ marginLeft: 20 }}>
              <input
                type="text"
                ref={(ref) => {
                  this.inputRefs[uid] = ref
                }}
                onKeyPress={(e) => this.onKeyPressAddItem(e, uid, child.id)}
              />
            </div>
          )}
        </div>
      )
    })
  }

  render() {
    const { items, canEdit, status, checkedItems } = this.state
    const tree = buildSkillTree(items)

    return (
      <>
        <div style={{ margin: 10 }}>
          <span>operation: </span>
          <button className="mr-2" onClick={this.onClickEdit}>
            edit mode
          </button>
          <button className="mr-2" onClick={this.onClickDelete} disabled={!checkedItems.length}>
            delete
          </button>
          <button onClick={this.onClickRename} disabled={checkedItems.length !== 1}>
            rename
          </button>
          <span style={{ color: 'red' }}>{status}</span>
        </div>
        {this.recurse(tree)}
        {canEdit && (
          <div style={{ marginLeft: 20 }}>
            <input
              type="text"
              ref={(ref) => {
                this.inputRefs[''] = ref
              }}
              onKeyPress={(e) => this.onKeyPressAddItem(e, '', 0)}
            />
          </div>
        )}
      </>
    )
  }
}

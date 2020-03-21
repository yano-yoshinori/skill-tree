import React, { Component } from 'react'

import data from '../data'
import { buildSkillTree } from '../services/SkillTree'

let baseId = 10000

type State = {
  items: any[]
  checkedItems: any[]
  isEdit: boolean
  status: string
}

export default class SkillTree extends Component {
  inputRefs: any = {}

  state: State = {
    items: [],
    checkedItems: [],
    isEdit: false,
    status: '',
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

  onClickEdit = () => {
    const { isEdit } = this.state
    this.setState({ isEdit: !isEdit })
  }

  onClickDelete = () => {
    const { items, checkedItems } = this.state

    this.setState({
      items: items.filter(item => {
        return !checkedItems.includes(item.uid)
      }),
    })
  }

  onChangeCheckItem = (uid: string) => {
    const { checkedItems } = this.state

    this.setState({
      checkedItems: checkedItems.concat(uid),
    })
  }

  recurse(children: any[]) {
    const { isEdit } = this.state
    return children.map(child => {
      const uid = `${child.parentId}-${child.id}`
      return (
        <div
          key={uid}
          style={{
            marginLeft: 20,
            borderLeft: isEdit ? '1px solid #CCC' : 'none',
          }}
        >
          {isEdit ? (
            <label style={{ cursor: 'pointer' }}>
              <input type="checkbox" onChange={() => this.onChangeCheckItem(uid)} />
              <span>{child.name}</span>
            </label>
          ) : (
            <div>{child.name}</div>
          )}

          {this.recurse(child.children)}
          {isEdit && (
            <div style={{ marginLeft: 20 }}>
              <input
                type="text"
                ref={ref => {
                  this.inputRefs[uid] = ref
                }}
                onKeyPress={e => this.onKeyPressAddItem(e, uid, child.id)}
              />
            </div>
          )}
        </div>
      )
    })
  }

  render() {
    const { items, isEdit, status } = this.state
    const tree = buildSkillTree(items)

    return (
      <>
        <div style={{ margin: 10 }}>
          <span>operation: </span>
          <button onClick={this.onClickEdit}>edit</button>
          <button onClick={this.onClickDelete}>delete</button>
          <span style={{ color: 'red' }}>{status}</span>
        </div>
        {this.recurse(tree)}
        {isEdit && (
          <div style={{ marginLeft: 20 }}>
            <input
              type="text"
              ref={ref => {
                this.inputRefs[''] = ref
              }}
              onKeyPress={e => this.onKeyPressAddItem(e, '', 0)}
            />
          </div>
        )}
      </>
    )
  }
}

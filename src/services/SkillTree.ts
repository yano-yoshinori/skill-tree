const recurse = (children: any[], items: any[], level = 0) => {
  children.forEach((child: any) => {
    child.uid = `${child.parentId}-${child.id}`
    child.level = level
    child.children = items.filter((item: any) => item.parentId === child.id)
    recurse(child.children, items, level + 1)
  })
}

export const buildSkillTree = (items: any[]): any[] => {
  const roots = items.filter(item => item.parentId === 0)
  recurse(roots, items)
  return roots
}

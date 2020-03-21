// id と name はセットでユニーク。
// 例えば既に登録済みの react という言葉を登録しようとした場合、既に react に割り振られている id がセットされる
export default [
  {
    id: 1,
    name: 'frontend',
    parentId: 0,
  },
  {
    id: 2,
    name: 'view',
    parentId: 1,
  },
  {
    id: 3,
    name: 'react',
    parentId: 2,
  },
  {
    id: 4,
    name: 'backend',
    parentId: 0,
  },
  {
    id: 5,
    name: 'framework',
    parentId: 4,
  },
  {
    id: 6,
    name: 'express',
    parentId: 5,
  },
]

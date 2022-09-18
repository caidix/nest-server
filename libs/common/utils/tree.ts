/**
 * 线性化数据树形
 * @param source
 * @param id
 * @param parentId
 * @param children
 */
export const listToTree = (
  source: any,
  id?: any,
  parentId?: any,
  children?: any,
) => {
  const sortArr: any = source.sort((a: any, b: any) => {
    return a[parentId] - b[parentId];
  });
  const minParentId =
    Array.isArray(sortArr) && sortArr.length > 0 ? sortArr[0].parentId : -1;
  const cloneData = JSON.parse(JSON.stringify(source));
  return cloneData.filter((father: any) => {
    const branchArr = cloneData.filter(
      (child: any) => father[id] === child[parentId],
    );
    branchArr.length > 0 ? (father[children] = branchArr) : '';
    return father[parentId] === minParentId;
  });
};

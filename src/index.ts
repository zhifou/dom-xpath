
export default (element: any, options?: any) => {
    // 设置缺省选项
    let defaultOptions: any = {
      unique: true,
      separtor: '-',
    };
    for (let key in options) {
      defaultOptions[key] = options[key];
    }
    options = defaultOptions;
    // 确定是否为元素节点
    if (element.nodeType != 1) {
      return null;
    }
    // 选择元素数组
    let paths: Array<string>[] = [];

    for (; element && element.nodeType == 1; element = element.parentNode) {
        // 确定元素是否存在
        if (!element || !element.nodeType) {
            return null;
        }
        let tag = element.nodeName.toLowerCase();
        let selector = tag;
        let selectorAttrs = [];

        // 判断是否要路径唯一性
        if (options.unique) {
            let siblingIndex = 0;
            for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                if (sibling.nodeType != 1) {
                    continue;
                }
                // 判断前面的兄弟节点是否和自己同名
                if (sibling.nodeName == element.nodeName) {
                    siblingIndex++;
                }
            }
            // html和body节点，不展示个数，另外只有一个节点时也不展示节点索引数量
            if (tag != 'html' && tag != 'body' && siblingIndex) {
                selector += siblingIndex + 1;
            }
        } else {
            // 如果节点有id属性，加入到属性数组中
            if (element.id) {
                selectorAttrs.push("@id='" + element.id + "'");
            }
            // 获取class名称，同样加入到属性数组中
            let className = element.className;
            let classList = [];
            if (className !== '') {
                classList = className.split(/\s+/);
            }
            // 如果有多个class，都需要加入
            if (classList.length >= 1) {
                let classAttrs = [];
                for (let i = 0; i < classList.length; i++) {
                    classAttrs.push(classList[i]);
                }
                selectorAttrs.push("@class='" + classAttrs.join(' ') + "'");
            }
            // 如果有属性，则增加在元素后面
            if (selectorAttrs.length >= 1) {
                selector += '[' + selectorAttrs.join(' and ') + ']';
            }
        }
        // 拼接到路径数组中
        paths.splice(0, 0, selector);
    }
    // 将元素数组拼接为字符串路径
    const pathStr = paths.length ? paths.join(options.separtor) : null;
    return pathStr;
}

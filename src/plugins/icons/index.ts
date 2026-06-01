import { addCollection } from '@iconify/vue'

import faSolid from './fa-solid.json'
import faRegular from './fa-regular.json'
import faBrands from './fa-brands.json'

/**
 * 本地离线注册项目用到的 FontAwesome 图标。
 *
 * @iconify/vue 默认在运行时按需从 api.iconify.design 联网拉取图标，
 * 网络不稳定时会出现"图标时有时无"。这里把用到的图标数据打包进项目、
 * 启动时一次性注册，运行时不再依赖网络，图标始终可用。
 *
 * 新增图标用法不变（<Icon icon="fa-solid:xxx" />）：
 * 若用到新的 fa-* 图标，记得把对应名字补进 src/plugins/icons/*.json
 * （可用 https://api.iconify.design/fa-solid.json?icons=名字 获取）。
 */
export function registerIcons() {
  addCollection(faSolid as Parameters<typeof addCollection>[0])
  addCollection(faRegular as Parameters<typeof addCollection>[0])
  addCollection(faBrands as Parameters<typeof addCollection>[0])
}

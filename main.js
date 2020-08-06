import { Wrapper, Text, create } from './createElement.js'
import { Panel } from './Panel'
import { TabPanel } from './TabPanel/index.js'
import { Carousel } from './Carousel/index.js'
import { ListView } from './ListView/index.js'

let component = <TabPanel>
                  <span title='张三的家'>炸了</span>
                  <span title='李四的家'>炸了</span>
                  <span title='张三的厕所'>也炸了</span>
                  <span title='张三的厕所'>又炸了</span>
                </TabPanel>

let carousel = <Carousel>
                 <span>播个文字</span>
                 <span style='color:blue;'>我爱播啥播啥</span>
                 <img src='https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg'></img>
                 <img src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595943080883&di=6cc62e6bc15a2ef96e4af93148839636&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg'></img>
                 <img src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595943080883&di=afe83485bf976837f2c4d938220b75c7&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F56%2F12%2F01300000164151121576126282411.jpg'></img>
               </Carousel>
let data = [
  {url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595943080883&di=afe83485bf976837f2c4d938220b75c7&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F56%2F12%2F01300000164151121576126282411.jpg',title: '张三的家'},
  {url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595943080883&di=6cc62e6bc15a2ef96e4af93148839636&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',title: '李四的家'}
]
let list = <ListView data={data}>
             {record => <figure>
                          <img src={record.url} />
                          <figcaption>
                            {record.title}
                          </figcaption>
                        </figure>}
           </ListView>
component.mountTo(document.body)
list.mountTo(document.body)
carousel.mountTo(document.body)

window.panel = component
window.carousel = carousel

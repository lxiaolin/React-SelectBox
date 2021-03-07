import React, {useRef, useState} from 'react';

import "./index.css"

export default function App() {
  //  深克隆
  function deepClone(origin, target = {}) {
    for (let prop in origin) {
      if (origin.hasOwnProperty(prop)) {
        if (origin[prop] !== null && typeof (origin[prop]) === "object") {
          Array.isArray(origin[prop]) ? target[prop] = [] : target[prop] = {};
          deepClone(origin[prop], target[prop]);
        } else {
          target[prop] = origin[prop];
        }
      }
    }
    return target;
  }

  //  获取容器项目
  function getBoxItem() {
    let BoxItem = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 12; j++) {
        BoxItem.push({
          col: j,
          row: i,
          selected: false,
        });
      }
    }
    return BoxItem;
  }

  const ITEM_WIDTH = 68;
  const ITEM_LEFT = 71;
  const [BoxItem, setBoxItem] = useState(getBoxItem());
  const BoxItemContainer = useRef();  //  Box容器
  const [showSelectBox, setShowSelectBox] = useState(false);  // 是否开启框选功能
  const [startX, setStartX] = useState(0);  //  鼠标按下起始位置横坐标
  const [startY, setStartY] = useState(0);  //  鼠标按下起始位置纵坐标
  const [selectBoxWidth, setSelectBoxWidth] = useState(0);  //  选择框宽度
  const [selectBoxHeight, setSelectBoxHeight] = useState(0);  //  选择框高度
  const [selectBoxLeft, setSelectBoxLeft] = useState(0);  //  选择框原点横坐标
  const [selectBoxTop, setSelectBoxTop] = useState(0);  //  选择框原点纵坐标
  const [leftMouseDown, setLeftMouseDown] = useState(false);  // 鼠标左键是否按下
  let cloneBoxItem = [];

  //  鼠标左键按下监听器
  function mouseDownListener(e) {
    console.log(e);
    if (e.buttons !== 1) {      //  判断鼠标左键按下
      return;
    }
    e.preventDefault();
    setLeftMouseDown(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  }

  //  鼠标移动监听器
  function mouseMoveListener(e) {
    if (!leftMouseDown) {
      return;
    }
    e.preventDefault();
    let {left, top} = BoxItemContainer.current.getBoundingClientRect(); //  容器上边(左边)到视窗上边(左边)的距离
    let [nowX, nowY] = [e.clientX - left, e.clientY - top]; //  鼠标当前的位置
    setSelectBoxLeft(Math.min(nowX, startX));
    setSelectBoxTop(Math.min(nowY, startY));
    setSelectBoxWidth(Math.abs(nowX - startX));
    setSelectBoxHeight(Math.abs(nowY - startY));
    setShowSelectBox(true);
    if (selectBoxWidth > 10 && selectBoxHeight > 10) {
      cloneBoxItem = deepClone(BoxItem, cloneBoxItem);
      cloneBoxItem.forEach(item => {
        item.selected = (ITEM_WIDTH + item.col * ITEM_LEFT) > selectBoxLeft
          && (ITEM_WIDTH + item.row * ITEM_LEFT) > selectBoxTop
          && item.col * ITEM_LEFT < selectBoxLeft + selectBoxWidth
          && item.row * ITEM_LEFT < selectBoxTop + selectBoxHeight
      });
      setBoxItem(cloneBoxItem);
    }
  }

  //  鼠标左键抬起监听器
  function mouseUpListener() {
    if (!leftMouseDown) {
      return;
    }
    setShowSelectBox(false);
    setLeftMouseDown(false);
  }

  //  鼠标移出BoxItem面板监听器
  function mouseLeaveListener() {
    if (!leftMouseDown) {
      return;
    }
    setShowSelectBox(false);
    setLeftMouseDown(false);
  }

  return (
    <div onMouseLeave={mouseLeaveListener} className="app">
      <div className="box"
           ref={BoxItemContainer}
           onMouseDown={e => mouseDownListener(e)}
           onMouseMove={e => mouseMoveListener(e)}
           onMouseUp={mouseUpListener}
      >
        {
          BoxItem.map(well => (
            <div key={well.row * 12 + well.col}
                 style={{borderStyle: well.selected ? "dashed" : "solid"}}
            >
            </div>
          ))
        }
        {
          showSelectBox
            ? <div className="SelectBox" style={{
              left: `${selectBoxLeft}px`,
              top: `${selectBoxTop}px`,
              width: `${selectBoxWidth}px`,
              height: `${selectBoxHeight}px`
            }}/>
            : null
        }
      </div>
    </div>
  );
}


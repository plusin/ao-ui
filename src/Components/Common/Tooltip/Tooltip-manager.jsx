import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTooltip, setActiveToolTip } from "../../../redux/UIFlowSlice";
import './tooltip.scss'
import { ItemTooltip } from "./ItemToolTip/item-tooltip";

export const TooltipTypes = {
  ITEM: 'Item',
  SPELL: 'Spell'
}
const toolTipWidth = 200

export const useTooltipHover = (contentInfo, type, targetRef) => {
  const [hoverState, setHoverState] = useState({timer:null, anchor: null})
  const dispatch = useDispatch()
  const isInsideRef = useRef(hoverState);

  useEffect(() => {
    isInsideRef.current = hoverState;
  }, [hoverState]);

  
  useEffect(() => {
    if (targetRef.current) {
      const anchorPos = targetRef.current.getBoundingClientRect()
      let anchorCenter = (anchorPos.left + anchorPos.width / 2) - (toolTipWidth / 2)
      if (anchorCenter + toolTipWidth > document.body.clientWidth) {
        anchorCenter -=  anchorCenter + toolTipWidth - document.body.clientWidth
      }
      setHoverState({...hoverState, anchor:{
        PosX: anchorCenter,
        PosY: anchorPos.bottom
      }})
    }    
  }, [targetRef]);
 
  const eventHandlers = useMemo(() => ({
    onMouseOver() { 
      if (!contentInfo || !type) return
      setHoverState({ ...isInsideRef.current,
        timer: setTimeout(() => {
          dispatch(setActiveToolTip({contentInfo, type, anchor:isInsideRef.current.anchor}))
          setHoverState({...isInsideRef.current,timer: null})
        }, 500)})
    },
    onMouseOut() { 
      clearTimeout(isInsideRef.current.timer)
      setHoverState({...isInsideRef.current, timer: null})
      dispatch(setActiveToolTip(null))
    }
  }), [contentInfo, dispatch, targetRef]);
  
  return [eventHandlers];
}

export const ActiveToolTip = () => {
  const activeToolTip = useSelector(selectTooltip)
  if (!activeToolTip || !activeToolTip.anchor) {
    return (<></>)
  }
  
  const posStyle = {
    width: `${toolTipWidth}px`,
    top: `${activeToolTip.anchor.PosY}px`,
    left: `${activeToolTip.anchor.PosX}px`,
    position: 'absolute',
    display: 'flex'
  }
  switch(activeToolTip.type) {
    case TooltipTypes.ITEM:
      break;
    case TooltipTypes.SPELL:
      break;
    default:
      break;
  }
  return (
    <div style={posStyle}>
      {{
          'Item':<ItemTooltip itemInfo={activeToolTip.contentInfo} />,
        }
        [activeToolTip.type]
      }
    </div>
  )
}
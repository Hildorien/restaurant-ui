
import ReactTooltip from "react-tooltip";
import { DarwinTooltipProps } from "./types"

const DarwinTooltip = ({id, text} : DarwinTooltipProps) => {
    return (
        <div>
            <i data-tip={"stat-" + id} data-for={'stat-' + id} className="uil uil-comment-info" style={{fontSize: '16px'}}></i>
            <ReactTooltip id={"stat-" + id} place={'top'}>
                <span style={{fontSize: '11px'}}>{text}</span>
            </ReactTooltip>
        </div>
    );
}

export default DarwinTooltip;
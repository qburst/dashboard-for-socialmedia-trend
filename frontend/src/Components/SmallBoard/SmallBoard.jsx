import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/fontawesome-free-solid';
import Icon from '@material-ui/core/Icon';
import './SmallBoard.css';


export default class SmallBoard extends React.Component {
    render() {
        const { label, value, className, showValue, handleClick} = this.props;
        return (
            <div class="col-sm-4 container_card">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col mt-0">
                                <h5 class="card-title">{label}</h5>
                            </div>

                            <div class="col-auto">
                                <div class="avatar">
                                    <div class="avatar-title rounded-circle bg-primary-dark">
                                        <FontAwesomeIcon icon={faUsers} />		
                                        {showValue && <Icon class="material-icons expand-board-icon" onClick={()=>handleClick(label)}>expand_less</Icon>}
                                        {!showValue && <Icon class="material-icons expand-board-icon" onClick={()=>handleClick(label)}>expand_more</Icon>}													
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showValue && <h1 class={"display-5 mt-1 mb-3 " + className}>{new Intl.NumberFormat().format(value)}</h1>}
                    </div>
                </div>
            </div>
        );
    }
}

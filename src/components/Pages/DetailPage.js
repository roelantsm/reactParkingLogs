import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'; 

export default class DetailPage extends Component {

    state = {
        id: null
    }

    componentDidMount(){
        let id = this.props.match.params.post_id;
        this.setState({
            id:id
        })
    }


    render() {
        return (
            <div>
                DetailPage {this.state.id}
            </div>
        )
    }
}

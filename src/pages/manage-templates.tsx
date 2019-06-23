import React, { Component } from "react";
import CustomGameConfig, { ICustomGameConfig } from '../models/CustomGameConfig';
import Loading from "../components/Loading";

interface State {
    loading: boolean;
    templates: ICustomGameConfig[];
}

class ManageTemplates extends Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true,
            templates: [],
        };
    }

    async componentDidMount() {
        const templates = await CustomGameConfig.getAll();
        this.setState({templates, loading: false});
    }

    public render() {
        if (this.state.loading) {
            return <Loading />
        }

        return <ul>
            {
                this.state.templates.map(item => 
                    <li key={item.id}>{item.name}</li>
                )
            }
        </ul>
    }
    
}

export default ManageTemplates;
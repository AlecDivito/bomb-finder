import React, { Component } from "react";
import CustomGameConfig, { ICustomGameConfig } from '../models/CustomGameConfig';
import Loading from "../components/Loading";
import Button from "../components/Button";

interface State {
    loading: boolean;
    templates: ICustomGameConfig[];
}

const COLUMN_NAMES: {name: string, key: keyof ICustomGameConfig }[] = [
    { name: "Name", key: "name" },
    { name: "Width", key: "width" },
    { name: "Height", key: "height" },
    { name: "Bombs", key: "bombs" },
    { name: "Created At", key: "createdAt" },
]

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

    deleteTemplate = async (template: ICustomGameConfig) => {
        console.log(template);
    }

    public render() {
        if (this.state.loading) {
            return <Loading />
        }

        return <table>
            <thead>
                <tr>
                {
                    COLUMN_NAMES.map(n => <th key={n.key}>{n.name}</th>)
                }
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
            {this.state.templates.map(item =>
                <tr key={item.id}>
                {COLUMN_NAMES.map(n =>
                    (n.key === "createdAt")
                        ? <td key={`${item.id}-${n.key}`} data-column={n.name}>{(item[n.key] as Date).toUTCString()}</td>
                        : <td key={`${item.id}-${n.key}`} data-column={n.name}>{item[n.key]}</td>
                )}
                    <td>
                        <Button type="button" text="Delete" onClick={() => this.deleteTemplate(item)} />
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    }
    
}

export default ManageTemplates;
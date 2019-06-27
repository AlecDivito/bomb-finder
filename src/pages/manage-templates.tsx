import React, { Component } from "react";
import CustomGameConfig, { ICustomGameConfig } from '../models/CustomGameConfig';
import Loading from "../components/Loading";
import Button from "../components/Button";
import "./manage-templates.css";

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

/**
 * TODO: Add custom logic to deal with an empty template grid
 * Or just hide it on the main page
 * 
 */
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
        const success = await CustomGameConfig.delete(template);
        if (success) {
            const templates = this.state.templates.filter(i => i.id! !== template.id!);
            this.setState({ templates });
        } else {
            // TODO: Add error handling
        }
    }

    public render() {
        if (this.state.loading) {
            return <Loading />
        }

        const dateOptions = {
            month: 'long', day: 'numeric',
            hour: "2-digit", minute: "2-digit"
        }

        return <div className="manage-templates">            
            <table className="templates-table">
                <caption className="templates-table__caption">Manage Templates</caption>
                <thead>
                    <tr className="templates-table__row">
                    {
                        COLUMN_NAMES.map(n => <th scope="col" key={n.key}>{n.name}</th>)
                    }
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {this.state.templates.map(item =>
                    <tr key={item.id} className="templates-table__row">
                    {COLUMN_NAMES.map(n =>
                        (n.key === "createdAt")
                            ? <td key={`${item.id}-${n.key}`}
                            data-column={n.name}>
                                {(item[n.key] as Date).toLocaleDateString("default", dateOptions)}
                            </td>
                            : <td key={`${item.id}-${n.key}`}
                            data-column={n.name}>
                                {item[n.key]}
                            </td>
                    )}
                        <td>
                            <Button type="button" text="Delete" onClick={() => this.deleteTemplate(item)} />
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    }
    
}

export default ManageTemplates;
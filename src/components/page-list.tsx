import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Page} from '../services/web-monitoring-db';

// export type IPageListProps = RouteComponentProps<{}>;
export interface IPageListProps extends RouteComponentProps<{}> {
    pages: Page[];
}

export default class PageList extends React.Component<IPageListProps, null> {
    constructor (props: IPageListProps) {
        super(props);
    }

    render () {
        if (!this.props.pages) {
            return <div>Loading…</div>;
        }

        return (
            <div className="container-fluid container-list-view">
                <div className="row">
                    <div className="col-md-12">
                        <table className="table">
                            <thead>
                                {this.renderHeader()}
                            </thead>
                            <tbody>
                                {this.props.pages.map(page => this.renderRow(page))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    renderHeader () {
        return (
            <tr>
                <th>ID</th>
                <th>Output Date</th>
                <th>Site</th>
                <th>Page Name</th>
                <th>URL</th>
                <th>Page View URL</th>
                <th>Last Two</th>
                <th>Latest to Base</th>
            </tr>
        );
    }

    renderRow (record: Page) {
        const version = record.latest;
        const versionistaData = version.source_metadata;

        const diffWithPrevious = this.renderDiffLink(versionistaData.diff_with_previous_url);
        const diffWithFirst = this.renderDiffLink(versionistaData.diff_with_first_url);

        const onClick = this.didClickRow.bind(this, record);

        const shortUrl = `${record.url.substr(0, 20)}…`;
        const rawContentPath = versionistaData.url.replace(/^\w+:\/\/[^\/]+\//, '');

        // TODO: click handling
        return (
            <tr key={record.uuid} onClick={onClick}>
                <td>{record.uuid}</td>
                <td>{record.latest.capture_time.toISOString()}</td>
                <td>{record.site}</td>
                <td>{record.title}</td>
                <td><a href={record.url} target="_blank" rel="noopener">{shortUrl}</a></td>
                <td><a href={versionistaData.url} target="_blank" rel="noopener">{rawContentPath}</a></td>
                <td>{diffWithPrevious}</td>
                <td>{diffWithFirst}</td>
            </tr>
        );
    }

    renderDiffLink (url: string) {
        if (url) {
            return <a href={url} target="_blank">{url.substr(-15)}</a>;
        }

        return <em>[Initial Version]</em>;
    }

    didClickRow (page: Page, event: React.MouseEvent<HTMLElement>) {
        if (isInAnchor(event.target)) {
            return;
        }

        this.props.history.push(`/page/${page.uuid}`);
    }
}

function isInAnchor (node: any): boolean {
    if (!node) {
        return false;
    }
    else if (node.nodeType === 1 && node.nodeName === 'A') {
        return true;
    }
    return isInAnchor(node.parentNode);
}

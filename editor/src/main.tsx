import * as React from "react";
import * as ReactDOM from "react-dom";
import "./main.css";
import { Editor } from "./components/Editor/editor";
import { ContractsList } from "./components/ContractsList/ContractsList";
import { AttributeEditor } from "./components/AttributeEditor/AttributeEditor";

type AppView = "contractList" | "editor" | "attributeEditor";

type AppState = {
  view: AppView;
  openedContractId?: string;
};
class App extends React.Component<{}, AppState> {
  state: AppState = {
    view: "contractList",
  };

  handleOpenList = () => this.setState({ view: "contractList" });

  handleContractOpen = (id?: string) =>
    this.setState({ view: "editor", openedContractId: id });

  handleEditAttribute = (id: string) => {
    this.setState({
      view: "attributeEditor",
      openedContractId: id,
    });
  };

  render() {
    const { view, openedContractId } = this.state;

    switch (view) {
      case "contractList":
        return (
          <ContractsList
            onContractOpen={this.handleContractOpen}
            onEditAttribute={this.handleEditAttribute}
          />
        );
      case "editor":
        return (
          <Editor onOpenList={this.handleOpenList} id={openedContractId} />
        );
      case "attributeEditor":
        return (
          <AttributeEditor
            onOpenList={this.handleOpenList}
            id={openedContractId}
          />
        );
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.querySelector("#application"));
});

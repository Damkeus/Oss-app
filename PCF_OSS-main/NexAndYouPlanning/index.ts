import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";

export class PlanningOSS implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private container: HTMLDivElement;

  public init(
    _context: ComponentFramework.Context<IInputs>,
    _notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.container = container;
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    const calendarJson = context.parameters.calendarJson.raw ?? null;
    const siteJson = context.parameters.siteJson.raw ?? null;
    const defaultView = context.parameters.defaultView.raw ?? null;
    ReactDOM.render(
      React.createElement(App, { calendarJson, siteJson, defaultView }),
      this.container
    );
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    ReactDOM.unmountComponentAtNode(this.container);
  }
}

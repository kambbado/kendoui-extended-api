/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../scripts/typings/kendo/kendo.all.d.ts" />

//----------------------------------------------------------------------------
module Kendo.Alerts {
    //----------------------------------------------------------------------------
    export interface Button {
        name?: string;
        click? (e: kendo.ui.WindowEvent): void;
    }
    //----------------------------------------------------------------------------
    export interface WindowOptions extends kendo.ui.WindowOptions {
        buttons?: Array<Kendo.Alerts.Button>;
        icon?: string;
        message?: string;
        deferred?: JQueryDeferred<any>;
    }
    //----------------------------------------------------------------------------
    export class Message {

        _options: Kendo.Alerts.WindowOptions = {};
        _dialog: kendo.ui.Window;
        _buttonTemplate = kendo.template('<div class="k-ext-dialog-buttons" style="position:absolute; bottom:10px; text-align:center; width:#= parseInt(width) - 14 #px;"><div style="display:inline-block"># $.each (buttons, function (idx, button) { # <button class="k-button" style="margin-right:5px; width:100px;">#= this.name #</button> # }) # </div></div>');
        _contentTemplate = kendo.template('<div class="k-ext-dialog-content" style="height:#= parseInt(height) - 55 #px;width:#= parseInt(width) - 14 #px;overflow:auto;">');
        _element: JQuery;

        //----------------------------------------------------------------------------
        constructor(options?: Kendo.Alerts.WindowOptions) {

            this._options = $.extend({
            }, options);

            return this;
        }
        //----------------------------------------------------------------------------
        show(): any {

            var that = this;

            this._element = $("#" + this._options.name);

            if (this._element.length > 0) {
                this._element.parent().remove();
            }

            $(document.body)
                .append(kendo.format("{0}{1}{2}",
                    kendo.format("<div id='{0}' style='position:relative;display:none;'>", this._options.name),
                    kendo.format("<div style='position:absolute;left:10px;top:10px;' class='{0}'>", this._options.icon),
                    kendo.format("</div><div style='display:inline-block;margin-left:45px;'>{0}</div></div>", this._options.message)
                    ));
            this._element = $("#" + this._options.name);
            this._dialog = this._element.kendoWindow().data("kendoWindow");
            this._dialog.setOptions(this._options);

            var html = this._element.html();
            this._element.html(this._contentTemplate(this._options));
            this._element.find("div.k-ext-dialog-content").append(html);

            // Create a div for the buttons.
            if (typeof this._options.buttons != "undefined") {
                this._element.after(this._buttonTemplate(this._options));
                // Create the buttons.
                $.each(this._options.buttons, function (idx, button) {
                    if (button.click) {
                        $(that._element.parent().find(".k-ext-dialog-buttons .k-button")[idx]).on("click", { handler: button.click }, function (e) {
                            e.data.handler({ button: this, dialog: that._dialog });
                        });
                    }
                });
            }

            // When the window resizes, position the content and button divs.
            this._dialog.bind("resize", function (e) {
                var $dialog = $(e.sender.element);
                var width = $dialog.width();
                var height = $dialog.height();

                $dialog.parent().find(".k-ext-dialog-buttons").width(width);

                $dialog.parent().find(".k-ext-dialog-content").width(width).height(height - 39);
            });
            this._element.parent().find("div.k-window-titlebar div.k-window-actions").empty();
            this._dialog.center().open().resize(true);
        }
        //----------------------------------------------------------------------------
        hide() {
            this._element.data("kendoWindow").close();
        }
        //----------------------------------------------------------------------------
        //----------------------------------------------------------------------------
        Error(sMessage: string, sTitle?: string): any {
            var that = this;
            return $.Deferred((deferred) => {
                this._options = $.extend({
                    name: "kendoMessageDialogWindowError",
                    message: sMessage,
                    icon: "k-ext-error",
                    resizable: true,
                    draggable: true,
                    width: "400px",
                    height: "100px",
                    title: sTitle,
                    buttons: [{
                        name: "OK",
                        click: function (e) {
                            e.dialog.close();
                            if (e.dialog.options.deferred != "undefined") {
                                e.dialog.options.deferred.resolve({ button: "OK" });
                            }
                        }
                    }],
                    modal: true,
                    visible: false,
                    deferred: deferred
                }, this._options);

                return this.show();
            });
        }
        //----------------------------------------------------------------------------
        Alert(sMessage: string, sTitle?: string): any {
            var that = this;
            return $.Deferred((deferred) => {
                this._options = $.extend({
                    name: "kendoMessageDialogWindowAlert",
                    message: sMessage,
                    icon: "k-ext-warning",
                    resizable: true,
                    draggable: true,
                    width: "400px",
                    height: "100px",
                    title: sTitle,
                    buttons: [{
                        name: "OK",
                        click: function (e) {
                            e.dialog.close();
                            if (e.dialog.options.deferred != "undefined") {
                                e.dialog.options.deferred.resolve({ button: "OK" });
                            }
                        }
                    }],
                    modal: true,
                    visible: false,
                    deferred: deferred
                }, this._options);

                return this.show();
            });
        }
        //----------------------------------------------------------------------------
        YesNo(sMessage: string, sTitle?: string): any {
            var that = this;

            return $.Deferred((deferred) => {
                this._options = $.extend({
                    name: "kendoMessageDialogWindowYesNo",
                    icon: "k-ext-question",
                    resizable: true,
                    draggable: true,
                    width: "400px",
                    height: "100px",
                    message: sMessage,
                    title: sTitle,
                    buttons: [{
                        name: "Yes",
                        click: function (e) {
                            e.dialog.close();
                            if (typeof e.dialog.options.deferred != "undefined") {
                                e.dialog.options.deferred.resolve({ button: "Yes" });
                            }
                        }
                    },
                        {
                            name: "No",
                            click: function (e) {
                                e.dialog.close();
                                if (typeof e.dialog.options.deferred != "undefined") {
                                    e.dialog.options.deferred.resolve({ button: "No" });
                                }
                            }
                        }],
                    modal: true,
                    visible: false,
                    deferred: deferred
                }, this._options);

                return this.show();
            });
        }
        //----------------------------------------------------------------------------
        OkCancel(sMessage: string, sTitle?: string): any {
            var that = this;

            return $.Deferred((deferred) => {
                this._options = $.extend({
                    name: "kendoMessageDialogWindowOkCancel",
                    icon: "k-ext-information",
                    resizable: true,
                    draggable: true,
                    width: "400px",
                    height: "100px",
                    message: sMessage,
                    title: sTitle,
                    buttons: [{
                        name: "OK",
                        click: function (e) {
                            e.dialog.close();
                            if (typeof e.dialog.options.deferred != "undefined") {
                                e.dialog.options.deferred.resolve({ button: "OK" });
                            }
                        }
                    },
                        {
                            name: "Cancel",
                            click: function (e) {
                                e.dialog.close();
                                if (typeof e.dialog.options.deferred != "undefined") {
                                    e.dialog.options.deferred.resolve({ button: "Cancel" });
                                }
                            }
                        }],
                    modal: true,
                    visible: false,
                    deferred: deferred
                }, this._options);

                return this.show();
            });
        }
        //----------------------------------------------------------------------------
        Wait(sMessage?: string, sTitle?: string): any {
            var that = this;

            if (typeof sMessage === "undefined") {
                sMessage = "";
            }
            if (typeof sTitle === "undefined") {
                sTitle = "";
            }

            return $.Deferred((deferred) => {
                this._options = $.extend({
                    name: "kendoMessageDialogWindowWait",
                    draggable: true,
                    width: "300px",
                    height: "100px",
                    icon: "k-ext-wait",
                    modal: true,
                    visible: false,
                    deferred: deferred,
                    title: sTitle,
                    message: sMessage
                }, this._options);

                this._element = $("#" + this._options.name);

                if (this._element.length > 0) {
                    this._element.parent().remove();
                }

                this.show();

                return deferred.resolve();
            });
        }
        //----------------------------------------------------------------------------
    }
    //----------------------------------------------------------------------------
}
//----------------------------------------------------------------------------
class Utilities {

    public static Info(sMessage: string, sTitle?: string) {
        $.when(new Kendo.Alerts.Message({
            icon: "k-ext-information"
        }).Alert(sMessage, sTitle));
    }
    public static Alert(sMessage: string, sTitle?: string) {
        $.when(new Kendo.Alerts.Message().Alert(sMessage, sTitle));
    }
    public static YesNo(sMessage: string, sTitle?: string) {
        return new Kendo.Alerts.Message().YesNo(sMessage, sTitle);
    }
    public static OkCancel(sMessage: string, sTitle?: string) {
        return new Kendo.Alerts.Message().OkCancel(sMessage, sTitle);
    }
    public static Error(sMessage: string, sTitle?: string) {
        return new Kendo.Alerts.Message().Error(sMessage, sTitle);
    }
    public static Wait(sMessage: string, sTitle?: string) {
        return new Kendo.Alerts.Message().Wait(sMessage, sTitle);
    }
    public static CloseWait() {
        $("#kendoMessageDialogWindowWait").data("kendoWindow").close();
    }
}
//----------------------------------------------------------------------------

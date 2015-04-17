'use strict';

var React = require('react/addons');
var FieldHelpers = require('./FieldHelpers');

var TextField = React.createClass({
    _fieldValue(field) {
        return field.default_value;
    },
    getInitialState() {
        return {
            typeName: this.props.typeName,
            field: this.props.field,
            title: this.props.title
        };
    },
    componentWillReceiveProps(props) {
        this.setState(props);
    },
    handleChange(evt) {
        this.props.onChange(this.state.title, evt.target.value);
    },
    render() {
        var field = this.state.field;
        var title = this.state.title;
        var typeName = this.state.typeName;

        var inputField;
        var value = this._fieldValue(field);
        var isRequired = !field.is_optional;
        var fieldType = (!FieldHelpers.hasAttribute(field.attributes, "textarea") && FieldHelpers.hasAttribute(field.attributes, "is_password") ? "password" : "text");

        if (FieldHelpers.hasAttribute(field.attributes, "textarea")) {
            inputField = (
                    <textarea id={title} className="textarea-xlarge form-control"
                              name={"configuration["+title+"]"} required={isRequired}
                              onChange={this.handleChange}>
                        {value}
                    </textarea>
            );
        } else {
            inputField = (
                <input id={title} type={fieldType} className="input-xlarge form-control" name={"configuration["+title+"]"}
                       onChange={this.handleChange} required={isRequired} defaultValue={this._fieldValue(field)}/>
            );
        }

        return (
            <div className="form-group">
                <label htmlFor={typeName + "-" + title + ")"}>
                    {field.human_name}
                    {FieldHelpers.optionalMarker(field)}
                </label>
                {inputField}
                <p className="help-block">{field.description}</p>
            </div>
        );
    }
});

module.exports = TextField;

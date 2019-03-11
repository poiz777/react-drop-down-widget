import React, { Component } from 'react';
import './DropDownWidget.css';
import jsonData from "./data/data";
import Indicator from "./Indicator";

class DropDownWidget extends Component {
    inputRefs = {
        dropDown            : React.createRef(),
        dropDownOptions     : React.createRef(),
        pzDropDownWrapper   : React.createRef(),
    };

    constructor(props){
      super(props);

      this.state  = {
        dropDownChildren: '',
      };
    }

    componentDidMount(){
        /**
         * HIDE DROP-DOWN LIST OF SUGGESTED TERMS
         * WHEN YOU CLICK OUTSIDE THE ENTIRE WIDGET...
         * THIS IS A WORKAROUND FOR ON-CLICK-OUTSIDE EVENT
         * THAT I CONJURED UP ON THE FLY...
         * FEEL FREE TO IMPLEMENT A BETTER ONE IF YOU KNOW ANY ;-)
         */
        document.addEventListener('click', (e) => {
            const ddWrapper             = this.inputRefs.pzDropDownWrapper.current;
            if(!ddWrapper.contains(e.target)){
                this.removeSuggestedChildren(e);
            }
        });
    }

    /**
     * BASED ON THE ENTERED TEXT ON THE MAIN INPUT FIELD,
     * THIS FILTERS THE RELEVANT MATCHES AND UPDATES THE RENDERED DROP-DOWN LIST
     * @param e
     * @returns {boolean}
     */
    updateDropDown(e){
        e.preventDefault();
        const suggestions   = jsonData.suggestions;
        const searchTerm    = this.inputRefs.dropDown.current.value;
        const rxSearch      = new RegExp(searchTerm, 'gi');
        let matches         = [];

        suggestions.forEach((suggestion) => {
            if(rxSearch.test(suggestion)){
                matches.push(suggestion);
            }
        });

        if(matches.length < 1){
            this.inputRefs.dropDown.current.value = '';
            return false;
        }

        this.renderDropDownChildren(matches);
    }

    /**
     * UPDATES THE MAIN INPUT FIELD...
     * INJECTS THE VALUE OF THE CURRENT ITEM-ON-FOCUS FROM WITHIN THE DROP-DOWN LIST
     * @param e
     */
    updateMainTextFieLdValue(e){
        this.inputRefs.dropDown.current.value = e.target.value;
    }

    /**
     * REMOVES THE VISIBLE LIST OF DROP-DOWN SUGGESTIONS.
     * @param e
     */
    removeSuggestedChildren(e){
        const dropDownChildren  = this.inputRefs.dropDownOptions.current;
        let dropDownClasses     = dropDownChildren.getAttribute('class');

        if(dropDownClasses.indexOf('pz-show') !== -1){
            dropDownClasses = dropDownClasses.replace('pz-show', 'pz-hide');
            dropDownChildren.setAttribute('class', dropDownClasses)
        }
    }

    handleChildKeyUp(e){}

    handleChildKeyDown(e){
        const targetField       = e.target;
        const targetParent      = targetField.parentNode;
        const keyCode       = e.which || e.keyCode;
        switch(keyCode) {
            case 9:         // TAB
                e.preventDefault();
                this.removeSuggestedChildren(e);
                break;

            case 13:        // ENTER
                e.preventDefault();
                this.removeSuggestedChildren(e);
                break;

            case 38:        // UP ARROW
                if(targetParent.previousSibling){
                    targetParent.previousSibling.children[0].focus()
                }
                break;

            case 40:        // DOWN ARROW
                if(targetParent.nextSibling){
                    targetParent.nextSibling.children[0].focus()
                }
                break;

            default:
                break;
        }

    }

    /**
     * DISPLAYS ALL POSSIBLE SUGGESTIONS...
     * @param e
     */
    showAllSuggestions(e){
        this.renderDropDownChildren(jsonData.suggestions);
        this.inputRefs.dropDown.current.focus();
    }

    /**
     * PREVENTS DEFAULT BEHAVIOUR FOR THE "TAB" & "ENTER" KEYS
     * @param e
     */
    static preventTabAndEnterDefaults(e){
        const keyCode       = e.which || e.keyCode;
        if(keyCode === 9 || keyCode === 13){
            e.preventDefault();
        }
    }

    /**
     * SELECTS AN ITEM ON THE DISPLAY LIST THAT HAS CURRENT FOCUS
     * WHEN THE TAB OR ENTER KEY IS PRESSED
     * @param e
     */
    selectOnTabOrEnter(e){
        DropDownWidget.preventTabAndEnterDefaults(e);
        const firstInputField   = this.inputRefs.dropDownOptions.current.children[0].children[0];
        const keyCode           = e.which || e.keyCode;

        switch(keyCode) {
            case 9:         // TAB
                this.inputRefs.dropDown.current.value = firstInputField.value;
                e.target.value = this.inputRefs.dropDown.current.value;
                firstInputField.focus();
                break;

            case 13:        // ENTER
                break;

            case 38:        // UP ARROW
                this.inputRefs.dropDown.current.value = firstInputField.value;
                e.target.value = this.inputRefs.dropDown.current.value;
                firstInputField.focus();
                break;

            case 40:        // DOWN ARROW
                this.inputRefs.dropDown.current.value = firstInputField.value;
                e.target.value = this.inputRefs.dropDown.current.value;
                firstInputField.focus();
                break;

            default:
                break;
        }
    }

    /**
     * BUILDS THE SUGGESTION LIST BASED ON INPUT TEXT (MATCHED STRING)
     * @param matches
     */
    renderDropDownChildren(matches){
        const dropDownChildren  = this.inputRefs.dropDownOptions.current;
        let dropDownClasses     = dropDownChildren.getAttribute('class');

        if(dropDownClasses.indexOf('pz-hide') !== -1){
            dropDownClasses = dropDownClasses.replace('pz-hide', 'pz-show');
            dropDownChildren.setAttribute('class', dropDownClasses)
        }

        const ddc = matches.map((suggestion, cueKey) => {
            return(
                <div className='pz-child-suggestion-box' key={cueKey}>
                    <input type='text'
                           readOnly={true}
                           className='pz-suggestion-input'
                           onFocus={(e)=>{this.updateMainTextFieLdValue(e)}}
                           onClick={(e)=>{this.removeSuggestedChildren(e)}}
                           onKeyUp={(e)=>{this.handleChildKeyUp(e)}}
                           onKeyDown={(e)=>{this.handleChildKeyDown(e)}}
                           value={suggestion} />
                </div>
            )
        });
        this.setState({
            dropDownChildren : ddc,
        });
    }

    render() {
      return (
        <div className="pz-drop-down-wrapper" ref={this.inputRefs.pzDropDownWrapper}>
            <div className="pz-drop-down">
                <input type="text"
                       className={jsonData.className}
                       name={jsonData.fieldName}
                       placeholder={jsonData.defaultValue}
                       ref={this.inputRefs.dropDown}
                       onChange={ (e)=>{ this.updateDropDown(e)}}
                       onKeyUp={ (e)=>{ this.selectOnTabOrEnter(e)}}
                       onKeyDown={ (e)=>{ DropDownWidget.preventTabAndEnterDefaults(e)}} />
                <Indicator showAllSuggestions={ e => this.showAllSuggestions(e) }/>
            </div>
            <div className="pz-drop-down-children pz-hide"
                 ref={this.inputRefs.dropDownOptions}>
                { this.state.dropDownChildren }
            </div>
        </div>
      );
    }
}

export default DropDownWidget;


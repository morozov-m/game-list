import JustValidate, { Rules } from "just-validate";
import { IEvents } from "../base/events";

export class FormValidator {
  private validator = new JustValidate(this.form, { 
    errorFieldCssClass: 'is-invalid',  
     });
     events: IEvents

  constructor(private form: HTMLFormElement, events: IEvents) {
     this.events = events
  }
  

  validate(config: 'add' | 'edit') {
  
   this.validator
    
       .addField('#img', [
    { 
      rule: Rules.MinFilesCount,
      value:  1,
      errorMessage: 'Загрузите картинку',
    },
  ],
    {
      errorsContainer: '#img-error',
    })

   
  .addField('#name', [
    {
      rule: Rules.Required,
      errorMessage: 'Введите название игры',
    },
    {
      rule: Rules.MaxLength,
      value: 50,
      errorMessage: 'Название не должно быть больше 50-ти символов'
    }
  ],
    {
      errorsContainer: '#name-error',
    })
  .addField('#hour', [
    {
      rule: Rules.Required,
      errorMessage: 'Введите количество потраченных часов',
    },
    {
      rule: Rules.MinNumber,
      value: 0,
      errorMessage: 'Значение не должно быть отрицательным'
    }
  ],
    {
      errorsContainer: '#hour-error',
    })

      .onSuccess(ev => {
        ev?.preventDefault();
       console.log('успех')
       if (config === 'add') {
        this.events.emit('form:validate', {form: 'add'})
        
       }
       else {
        this.events.emit('form:validate', {form: 'edit'})

       }
       
      });

      if (config === 'edit') {
        this.validator.removeField('#img');
      }
  }






  clearErrors() {
    this.validator.refresh()

  }
  
  }

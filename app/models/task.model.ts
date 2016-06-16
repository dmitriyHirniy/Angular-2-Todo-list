import {SubTask} from "./subtask.model";
export class Task{
    public class: string;
    public editBtnClass:string;
    public percent: string;
    public percentText: string;
    public editBtnText: string = "Edit text";
    public completed: boolean;
    public progressBarClass: string;
    public subTaskStyle: string;
    constructor(public title: string, public status: string, public textEditable: boolean, public tasks: SubTask[] ){
        switch (status){
            case "In the plan":
                  this.class = "list-group-item-info";
                  this.percent = "10%";
                  this.percentText = "10% Complete";
                  this.progressBarClass = "progress-bar-info";
                break;
            case "In progress":
                  this.class = "list-group-item-warning";
                  this.progressBarClass = "progress-bar-warning";
                 // this.percent = "60%";
                 // this.percentText = "60% Complete";
                break;
            case "Completed": 
                  this.class = "list-group-item-success";
                  this.percent = "100%";
                  this.percentText = "100% Complete";
                  this.completed = true;
                  this.progressBarClass = "progress-bar-success";
                break;
            default: this.class = "list-group-item-info";
        }
        if(textEditable) this.editBtnClass = "btn btn-success btn-sm editTextButton"; 
        else this.editBtnClass= "btn btn-danger btn-sm editTextButton";

        if(tasks.length == 1 && tasks[0].title == "No subtasks") this.subTaskStyle = "none";
        if(this.status!="Completed"){
        if(tasks.length == 1)
        {
            if(tasks[0].title == "No subtasks"){
                this.subTaskStyle = "none";
                if(this.status == "In the plan") {
                    this.percent = "0%";
                    this.percentText = "0% Complete";
                }else {
                    this.percent = "10%";
                    this.percentText = "10% Complete";
                }
            }
        }else{
            let completed = 0;
            for(let i=0;i<tasks.length;i++){
                if(tasks[i].isDone) completed++;
            }
            let percent = Math.round( 100/tasks.length*completed);
            this.percent = percent+"%";
            this.percentText = percent+"% Complete";

            if(completed > 0 && completed !=tasks.length ){
                this.class = "list-group-item-warning";
                this.status = "In progress";
                this.progressBarClass = "progress-bar-warning";
            }
            if(percent == 100) {
                this.class = "list-group-item-success";
                this.status = "Completed";
                this.completed = true;
                this.progressBarClass = "progress-bar-success";
            }
        }
       }
    }
}

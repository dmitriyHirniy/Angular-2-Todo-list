import {Component, Input} from '@angular/core';
import {SearchFiler} from "../pipes/search.pipe";
import {TaskService} from "../services/task.service";
import {FilterService} from "../services/filter.service";
import {StatusService} from "../services/status.service";
import {Task} from "../models/task.model";
import {SubTask} from "../models/subtask.model";
import {UserService} from "../services/user.service";
import {MovieService} from "../services/users.service";
@Component({
    selector: 'main-component',
    templateUrl: 'app//html/main.html',
    pipes: [SearchFiler],
    providers: [TaskService, FilterService, StatusService, UserService]
})
export class MainComponent { 

    @Input() status;

    //The setting of component
    public Settings: Object = {
        message:          "All is fine",
        messageClass:     "alert alert-success",
        messageVisible:   "hidden",
        editButtonText:   "Edit text",
        subTaskTitle:     "",
        editable:         false
    };


    message:string = "All is fine";
    messageClass:string = "alert alert-success";
    messageVisible:string = "hidden";
    
    editButtonText: string = "Edit text";

    editable: boolean = false;
    constructor(public taskService: TaskService, public filterService: FilterService, public statusService: StatusService, public userService: UserService){
      //  console.log("Con "+this.userService.loadUser());
    }


    filters: string[] = [
        "All tasks",
        "In the plan",
        "In progress",
        "Completed"
    ];

    subTaskTitle: string = "";

    public currentTask: Task = new Task("", "In the plan", false, [new SubTask("No subtasks", false)]);

    public mainTask:Task = new Task("", "In the plan", false, [new SubTask("No subtasks", false)]);

    changeMainTask(task: Task):void{
        this.mainTask = task;
    }

    onChange(value: string, task: Task):void
    {
        switch (value){
            case "In the plan":
                task.class = "list-group-item-info";
                task.percent = "0%";
                task.percentText = "0% Complete";
                task.progressBarClass = "progress-bar-info";
                break;
            case "In progress":
                task.class = "list-group-item-warning";
                task.percent = "10%";
                task.percentText = "10% Complete";
                task.progressBarClass = "progress-bar-warning";
                break;
            case "Completed":
                task.class = "list-group-item-success";
                task.percent = "100%";
                task.percentText = "100% Complete";
                task.completed = true;
                task.progressBarClass = "progress-bar-success";
                for(let i=0;i<task.tasks.length;i++){
                    task.tasks[i].done();
                    task.subTaskStyle = "none";
                }
        }

        var s = "Hello";
        s[0] = 'T';
    }

    onSubmit():void
    {

       // let str = JSON.stringify( this.tasks );

      //  localStorage.setItem( "TaskStorage", str+"," +localStorage.getItem("TaskStorage") );
      //  localStorage.setItem( "TaskStorage", '{'+'"tasks":'+str+'}');
        console.log("Local: "+localStorage.getItem("TaskStorage"));

       /* if(this.currentTask.title.length > 3) {
            this.taskService.add(this.currentTask);
            this.currentTask = new Task("", "In the plan",false, [new SubTask("No subtasks", false)]);
        }else {
            this.message = "Input todo is small , give more information.";
            this.messageClass = "alert alert-danger";
        }
        */
        this.tasks.push(this.currentTask);
        this.currentTask = new Task("", "In the plan",false, [new SubTask("No subtasks", false)]);
        this.resetJSON();
    }

    private resetJSON():void{
        let str = JSON.stringify( this.tasks );
        localStorage.setItem( "TaskStorage", '{'+'"tasks":'+str+'}');
    }

    changeEditable(task: Task):void{
        if(task.textEditable) {
            task.editBtnClass = "btn btn-danger btn-sm editTextButton";
            task.textEditable = false;
           // this.editButtonText = "Edit text";
            task.editBtnText = "Edit text";
        }
        else {
            task.editBtnClass = "btn btn-success btn-sm editTextButton";
            task.textEditable = true;
          //  this.editButtonText = "Editing";
            task.editBtnText = "Editing";
        }
    }

    subTaskDone(task: Task, subTask: SubTask ):void{
        if(subTask.title !="No subtasks") {
            subTask.done();
            let completed = 0;
            for (let i = 0; i < task.tasks.length; i++) {
                if (task.tasks[i].isDone) completed++;
            }
            let percent = Math.round(100 / task.tasks.length * completed);
            task.percent = percent + "%";
            task.percentText = percent + "% Complete";
            if (completed > 0 && completed != task.tasks.length) {
                task.class = "list-group-item-warning";
                task.status = "In progress";
            }
            if (percent == 100) {
                task.class = "list-group-item-success";
                task.status = "Completed";
                task.completed = true;
            }
            this.resetJSON();
        }
    }

    addSubTask():void{
        this.mainTask.subTaskStyle = "default";
        if(this.mainTask.tasks[0].title == "No subtasks")
        {
            this.mainTask.tasks.splice( 0,1 );
        }
        this.mainTask.tasks.push( new SubTask(this.subTaskTitle, false) );
        this.subTaskTitle= "";
        this.taskService.resetSubTasks( this.mainTask );
        this.resetJSON();
    }

    removeSubTask(subtask: SubTask):void{
        let index = this.mainTask.tasks.indexOf(subtask);
        this.mainTask.tasks.splice( index, 1 );
        this.taskService.resetSubTasks( this.mainTask );
    }

    removeTask(task:Task): void{
        let index = this.taskService.tasks.indexOf( task );
        this.taskService.tasks.splice( index, 1 );
    }

    tasks: Task[];
    ngOnInit(): void{
        this.tasks = [];
        this.parseUserTasks(this.tasks);
    }

    parseUserTasks(tasks: Task[]):void{

       /* $.getJSON( "app/data/data.json", function(data){

            let length = data.tasks.length;
            let subTasks;
            for(let i = 0;i<length;i++)
            {
                subTasks = [];
                if(data.tasks[i].tasks.length != 0) {
                    for (let j = 0; j < data.tasks[i].tasks.length; j++) {
                        subTasks.push(new SubTask(data.tasks[i].tasks[j].title, data.tasks[i].tasks[j].isDone));
                    }
                }else {
                    subTasks.push( new SubTask("No subtasks", false));
                }
                tasks.push(new Task( data.tasks[i].title, data.tasks[i].status, data.tasks[i].textEditable,  subTasks ));
            }

        } )
*/


       let data = JSON.parse(localStorage.getItem("TaskStorage"));
        let length = data.tasks.length;
        let subTasks;
        for(let i = 0;i<length;i++)
        {
            subTasks = [];
            if(data.tasks[i].tasks.length != 0) {
                for (let j = 0; j < data.tasks[i].tasks.length; j++) {
                    subTasks.push(new SubTask(data.tasks[i].tasks[j].title, data.tasks[i].tasks[j].isDone));
                }
            }else {
                subTasks.push( new SubTask("No subtasks", false));
            }
            tasks.push(new Task( data.tasks[i].title, data.tasks[i].status, data.tasks[i].textEditable,  subTasks ));
        }

    }

    
}

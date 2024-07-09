import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    /**
     * Returns all tasks
     * @returns Task[] tasks
     */
    public getAllTasks(): Task[] {
        return this.tasks;
    }

    /**
     * getTask
     */
    public getTask(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    /**
     * getTasksWithFilter
     */
    public getTasksWithFilter(filterDTO: GetTasksFilterDTO): Task[] {
        const { status, search } = filterDTO;
        return this.tasks.filter(task => task.status === status || task.title.includes(search) || task.description.includes(search))
    }

    /**
     * Create a new Task
     * @param createTaskDTO 
     * @returns 
     */
    public createTask(createTaskDTO: CreateTaskDTO): Task {
        const { title, description } = createTaskDTO;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task);

        return task;
    }

    /**
     * Delete Task
     * @param id id of task
     */
    public deleteTask(id: string): void {
        this.tasks.find((task, index, arr) => {
            if (task.id === id) {
                arr.splice(index, 1);
                return true;
            }
            return false;
        })
    }

    /**
     * patchTask
     */
    public patchTask(id: string, param: string, value: string): Task {
        const task = this.tasks.find(task => task.id === id);
        task[param] = value;
        return task;
    }
}


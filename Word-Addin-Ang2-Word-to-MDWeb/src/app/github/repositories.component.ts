import {Component} from '@angular/core';
import {Repository} from '../shared/repository';
import {OnInit} from '@angular/core';
import {GithubService} from './github.service';
import {Router} from '@angular/router';

@Component({
    selector: 'my-repositories',
    template: `
        <h2 >Repositories</h2>
        <ul class="ms-List">
            <li class="ms-ListItem is-selectable" *ngFor="let item of repositories" (click)="onSelect(item)">
                <span class="ms-ListItem-primaryText">{{item.name}}</div>
             </li>
        </ul>   
    `
})

export class RepositoriesComponent implements OnInit {
    repositories: Repository[];

    constructor(private _githubService: GithubService, private _router: Router) {}

    onSelect(item: Repository) {
        //this._router.navigate(['/repositories/:index/files', item.name]);
    }

    ngOnInit(): any {
        this._githubService.getAllRepositoriesForUser()
            .then(repositories => this.repositories = repositories)
    }
}
import {Component} from '@angular/core';
import {Repository} from '../shared/repository';
import {OnInit} from '@angular/core';
import {GithubService} from './github.service';
import {Router} from '@angular/router-deprecated';

@Component({
    selector: 'my-repository-list',
    template: `
        <ul>
            <li *ngFor="let item of repositories" (click)="onSelect(item)">
                <div class="item">{{item.name}}</div>
             </li>
        </ul>  
    `
})

export class ListRepositoriesComponent implements OnInit {
    repositories: Repository[];

    constructor(private _githubService: GithubService, private _router: Router) {}

    onSelect(item: Repository) {
        this._router.navigate(['Files', {repositoryIndex: +this._githubService.getRepositoryIndex(item)}]);
    }

    ngOnInit():any {
        this.repositories = this._githubService.getAllRepositoriesForUser();
    }
}
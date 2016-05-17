import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {GithubService} from './gitHub.service';
import {Router} from '@angular/router-deprecated';
import {MdFile} from '../shared/file';

@Component({
    selector: 'my-md-files-list',
    template: `
        <ul>
            <li *ngFor="#item of files" (click)="onSelect(item)">
                <div class="item">{{item.name}}</div>
             </li>
        </ul>  
    `
})

export class ListFilesComponent implements OnInit {
    files: MdFile[];

    constructor(private _githubService: GithubService, private _router: Router) {}

    onSelect(item: MdFile) {
        this._router.navigate(['FileDetail', {fileIndex: +this._githubService.getFileIndex(item)}]);
    }

    ngOnInit():any {
        this.files = this._githubService.getAllMDFilesInRepo();
    }
}
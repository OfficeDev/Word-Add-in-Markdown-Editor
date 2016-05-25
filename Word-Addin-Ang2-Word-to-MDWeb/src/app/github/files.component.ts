import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {GithubService} from './gitHub.service';
import {Router} from '@angular/router';
import {MdFile} from '../shared/file';

@Component({
    selector: 'my-md-files-list',
    template: `
        <ul class="ms-List">
            <li class="ms-ListItem is-selectable" *ngFor="#item of files" (click)="onSelect(item)">
                <span class="ms-ListItem-primaryText">{{item.name}}</div>
             </li>
        </ul>  
    `
})

export class FilesComponent implements OnInit {
    files: MdFile[];

    constructor(private _githubService: GithubService, private _router: Router) {}

    onSelect(item: MdFile) {
        this._router.navigate(['/repositories/:index/files/:fileindex', {fileIndex: +this._githubService.getFileIndex(item)}]);
    }

    ngOnInit(): any {
        this._githubService.getAllMDFilesInRepo()
            .then(files => this.files = files)
    }
}
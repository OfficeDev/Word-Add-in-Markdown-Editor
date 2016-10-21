import { GithubService } from './github.service';
import { MarkdownService } from './markdown.service';
import { WordService } from './word.service';
import { MediatorService } from './mediator.service';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from './auth.guard';
import { NotificationService } from './notification.service';

export * from './github.service';
export * from './markdown.service';
export * from './word.service';
export * from './mediator.service';
export * from './models';
export * from './favorites.service';
export * from './auth.guard';
export * from './notification.service';

export const SERVICES = [
    GithubService,
    MarkdownService,
    WordService,
    MediatorService,
    FavoritesService,
    AuthGuard,
    NotificationService
];
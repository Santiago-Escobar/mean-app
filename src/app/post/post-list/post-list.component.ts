import { Component, Input } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {

  // posts = [
  //   {title: "first", content: "first item content"},
  //   {title: "second", content: "second item content"},
  //   {title: "third", content: "third item content"}
  // ];
  @Input() posts = [];
}

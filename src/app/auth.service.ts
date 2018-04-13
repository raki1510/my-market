import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import 'rxjs/add/operator/switchMap';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AppUser } from './models/app-user';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';


@Injectable()
export class AuthService {
  user$: Observable<firebase.User>;
  constructor(private userService: UserService, private afauth: AngularFireAuth, private route: ActivatedRoute) {
    this.user$ = afauth.authState;
  }
login() {
 let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
 localStorage.setItem('returnUrl', returnUrl );
  this.afauth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
}
logout() {
  this.afauth.auth.signOut();
}
get appUser$(): Observable<AppUser> {
  return this.user$
    .switchMap(user => {
      if (user) {
       return this.userService.get(user.uid);
      } else {
        return Observable.of(null);
      }
    });
}
}

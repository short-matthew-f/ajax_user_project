## Day 1

Our goal today is to communicate with the API which has our data, and to get it to be visible to the user.

Our API has a common base url, so set it at the top of the app:

```js
const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';
```

So when we want to get all of the users, for example, we can build our URL this way:

```js
`${ BASE_URL }/users`
```

### Get our users

Let's start by writing a function, `fetchUsers`, which will fetch our users.

```js
function fetchUsers() {
  return fetch(/* some url */).then(function (response) {
    // call json on the response, and return the result
  }).catch(function (error) {
    // use console.error to log out any error
  });
}
```

A note about the overall structure here:

* We want each of these methods to **return** the still unfinished promise that `fetch` returns so we can use `.then` wherever we call `fetchUsers`

    ```js
    fetchUsers().then(function (data) {
      // the data is here!
    });
    ```

* We can add a `.catch` here which logs the error, without stopping ourselves from calling catch a second time later
* We want to apply the first `.then` which does the work of converting the response from JSON to an actual object

Once you write the then and catch, as well as provide the appropriate URL, go ahead and test it out.

```js
fetchUsers().then(function (data) {
  console.log(data);
});
```

### What do we do with our users?

Whenever we fetch some data, it's important to inspect it and get an idea of what it looks like.

In our case, we are getting back an array of objects:

```js
[
  {
    id: 1, 
    name: "Leanne Graham", 
    username: "Bret", 
    email: "Sincere@april.biz", 
    address: {
      …
    }, 
    …
  },
  {
    id: 2, 
    name: "Ervin Howell", 
    username: "Antonette", 
    email: "Shanna@melissa.tv", 
    address: {
      …
    }, 
    …
  },
  …
]
```

Perfect, we know how to work with both arrays and objects by now.  We have an array of users, so let's build the first two functions to show them to the end user:

```js
function renderUser(user) {

}

function renderUserList(userList) {

}
```

The first will rely on our ability to use templating, and the second will rely on our ability to loop and append.

#### `renderUser`

Here is the correct rendered user card:

```html
<div class="user-card">
  <header>
    <h2>Leanne Graham</h2>
  </header>
  <section class="company-info">
    <p><b>Contact:</b> Sincere@april.biz</p>
    <p><b>Works for:</b> Romaguera-Crona</p>
    <p><b>Company creed:</b> "Multi-layered client-server neural-net, which will harness real-time e-markets!"</p>
  </section>
  <footer>
    <button class="load-posts">POSTS BY Bret</button>
    <button class="load-albums">ALBUMS BY Bret</button>
  </footer>
</div>
```

Use this any way you see fit to complete `renderUser`.  

#### `renderUserList`

The goal is relatively simple.  Grab the element with id equal to `user-list`, empty it, and then append the result of `renderUser` to it for each user in the `userList`.

#### Test it out

So, go ahead and try out what you've done so far:

```js
// at the bottom of your code
fetchUsers().then(function (data) {
  renderUserList(data);
});
```

Which, by the way, can be replaced.  When your function takes an input and only calls another function with that same input, you can replace the outer one with the inner one... just make sure to leave it **uncalled**:

```js
// at the bottom of your code
fetchUsers().then(renderUserList);
```

If you've built this correctly you should have a bunch of cards on the left side of your page.

#### Bootstrapping

We might need to do more than what we just wrote, so let's write a `bootstrap` function:

```js
function bootstrap() {
  // move the line about fetchUsers into here
}

bootstrap();
```

Confirm that the app still loads and displays users before moving on.

### Interactivity

Those user cards have two buttons: one for loading posts and one for loading albums.  We might not make both of those AJAX calls right now, but we will hook up the listeners right now.

We are dynamically creating elements and adding them to the page.  Remember, if you want to listen to an interaction with an element created after the page is created you have to delegate the responsibility to something up the chain:

```js
$('#user-list').on('click', '.user-card .load-post', function () {
  // load posts for this user
  // render posts for this user
});

$('#user-list').on('click', '.user-card .load-albums', function () {
  // load albums for this user
  // render albums for this user
});
```

Wait, we need to know which user we are talking about whenever we click on those buttons. Let's go back and update the `renderUser` function.

Before returning the element you create, use the `data` method to attach the user.  (Remember, it's like this: `.data('user', user)`)

Now, come back, and in both of those click handlers recover the user object that we just attached.

Do that by using the element `$(this)`, and the `.closest()` function to get back up to the element that actually had the data attached to it.

Make sure you did it correctly by logging out the user object in both of the two click handlers.


## Day 2

Today we are going to load and show the user albums. These albums also contain photos, which we will also have to render!

We have to write the following functions:

```js
/* get an album list, or an array of albums */
function fetchUserAlbumList(userId) {

}

/* render a single album */
function renderAlbum(album) {

}

/* render a single photo */
function renderPhoto(photo) {

}

/* render an array of albums */
function renderAlbumList(albumList) {

}
```

### `fetchUserAlbumList`

Ok, so like before we need to call `fetch` for the correct URL... but unlike before we need to interpolate the `userId` into the URL we intend to use:

```js
function fetchUserAlbumList(userId) {
  fetch(`${ BASE_URL }/users/${/* something */}/albums`).then(function (response) {
    // convert from JSON to an object, and return
  }).catch(function (error) {
    // console.error out the error
  })
}
```

Get this working, and test it out with the code below:

```js
fetchUserAlbumList(1).then(function (albumList) {
  console.log(albumList);
});
```

You should see a list of albums for the user with `id` equal to 1.

### Refactoring

#### WET

We are at the point where we are writing very similar functions: `fetchUsers` and `fetchUserAlbumList` really feel similar... 

The term **WET** is short for "Write Everything Twice", and is a counterpoint to **DRY** (or Don't Repeat Yourself).  The idea is that until you see a true need to refactor your code, feel free to write similar things a few times. Being efficient can come at the expense of readability or being able to extend your code when you need to, later.

#### `fetchData`

Let's write a helper function, called `fetchData`

```js
function fetchData(url) {

}
```

This function should:

* Call `fetch` on the passed in url
* Using `.then`, convert the incoming response JSON to an object
* Using `.catch`, log an error when we catch one
* Return the result of the fetch

The way we will use it later is like this:

```js
function fetchUsers() {
  return fetchData(`THE URL WE MADE`);
}

function fetchUserAlbumList(userId) {
  return fetchData(`THE OTHER URL WE MADE`);
}
```

And so on... the complicated parts which might need to change later are in `fetchUserData`, and the simple usage of it based on use-case are in our unique fetch functions.

Update the two fetch methods to use our new `fetchData`, and see if they still work using your existing code.

```js
// This should still be the same!
fetchUserAlbumList(1).then(function (albumList) {
  console.log(albumList);
}); 
```

### The Albums are rather empty...

Let's update the URL we build in `fetchUserAlbumList`:

```js
function fetchUserAlbumList(userId) {
  return fetchData(`${ BASE_URL }/users/${ userId }/albums?_expand=user&_embed=photos`);
}
```

You can see that we've added two query parameters.  Both of these are part of the API, since it uses a package called [json-server](https://github.com/typicode/json-server).  It's really useful, and let's us do two things:

* It will expand the user object based on the `userId` and make it available in each album object
* It will add the photos whose `albumId` are the correct `album.id` to each of the album objects.

Run our test code from before, and fetch and display the albums for user number 1. You will know you've done well when you get an array of albums, each of which has a user property and a photos property.  Furthermore the photos property should hold an array of photos.

### Render EVERYTHING

Below are templates for the relevant elements:

#### Album Card

Related to `renderAlbum` and `renderAlbumList`:

```html
<div class="album-card">
  <header>
    <h3>quidem molestiae enim, by Bret </h3>
  </header>
  <section class="photo-list">
    <div class="photo-card"></div>
    <div class="photo-card"></div>
    <div class="photo-card"></div>
    <!-- ... -->
  </section>
</div>
```

#### Photo Card

Related to `renderPhoto`:

```html
<div class="photo-card">
  <a href="https://via.placeholder.com/600/92c952" target="_blank">
    <img src="https://via.placeholder.com/150/92c952">
    <figure>accusamus beatae ad facilis cum similique qui sunt</figure>
  </a>
</div>
```

#### `renderPhoto`

This is not very fancy.  You should be able to do this in any way you wish.

#### `renderAlbum`

So here, we need to do the following.  Start by creating the `album-card` element with an empty `photo-list` element in it.

Then, loop over the `album.photos` and append the result of `renderPhoto` into the element matching `.photo-list`.

#### `renderAlbumList`

Here we bring it all together.

First, remove the class "active" from any `#app section.active`.  We want to do this because we might be switching from album view to posts view, and wouldn't want both to be active at the same time.

Then, add the class active to `#album-list`, and make sure to call `.empty()` on it as well.  This will show the right section as well as ensure any old albums are removed.

Lastly, loop over the `albumList` and append the result of `renderAlbum` to the `#album-list` element for each album in the list.

You can test this out below:

```js
// at bottom
fetchUserAlbumList(1).then(renderAlbumList);
```

### Interactivity

We want to actually have our album list related to the specific user we click on, rather than just always for user number 1.

Go back to our click handler for `.load-album` and replace the logging from the previous module with calling `fetchUserAlbumList`, passing in the `user.id` from our recovered user object.  

Make sure to attach a `.then` callback which renders the album list (see above), and you should be perfect.

Test it out by clicking on different user's **SHOW ALBUMS** buttons, and watch them change.

## Day 3

Now the time has come to view user posts.  Just like albums, these have an embedded object (comments).  Unlike albums, we're going to use this as an opportunity to build something neat - a rudimentary form of caching.

Caching is the process of holding on to frequently used data to prevent subsequent requests, to make it more readily available without requiring valuable resources.  

### Our two fetches

As a gift, I'll start you off with the two fetch methods we'll need to get data:

```js
function fetchUserPosts(userId) {
  return fetchData(`${ BASE_URL }/users/${ userId }/posts?_expand=user`);
}

function fetchPostComments(postId) {
  return fetchData(`${ BASE_URL }/posts/${ postId }/comments`);
}
```

Of course, you should try both of these to see what data comes back from them.

```js
fetchUserPosts(1).then(console.log); // why does this work?  Wait, what?  

fetchPostComments(1).then(console.log); // again, I'm freaking out here! What gives!?
```

So, seriously, explain to yourself why `console.log` is a valid thing to put where a callback function would go. What does a `.then` function have to look like, and does `console.log` satisfy it?

Neat.

#### Important Note

We are separating fetching posts and fetching comments.  The goal here is that when we click on the "see comments" button for a post, we will load the comments and show them to the user.

### `setCommentsOnPost`

This function will take a post object, fetch the comments for it, and then attach them to the post object itself.  It relies on the fact that objects in JavaScript are mutable.  When we change the base object, it changes for good.

```js
function setCommentsOnPost(post) {
  // post.comments might be undefined, or an []
  // if undefined, fetch them then set the result
  // if defined, return a rejected promise
}
```

So, here is where we are going to get tricky... this is fun, so buckle up and get ready for a ride.

We want to return a promise no matter what, so that we can use the function like this:

```js
setCommentsOnPost( somePost )
  .then(function(post) {
    // render & show the comments
  })
  .catch(function(error) {
    // just show or hide the already rendered comments
  });
```

And this makes a bit of sense.  Trying to load and set the comments on a post a second time is an ok reason to throw an error (caught by the `.catch` method).

So, we should be writing code like this:

```js
function setCommentsOnPost(post) {
  // if we already have comments, don't fetch them again
  if (post.comments) {
    // #1: Something goes here
  }

  // fetch, upgrade the post object, then return it
  return fetchPostComments(post.id)
            .then(function (comments) {
    // #2: Something goes here
  });
}
```
#### Number 2. Wait, number 2?

Number 2 is our successful fetch, so let's start there.

What goes in #2?  We are returning the result of `fetchPostComments`, which is a promise.  If we stopped there, then outside the function we would be only catching the comments... what if we want the post _and_ its comments?

#### An aside on promises

```js
const successfulPromise = Promise.resolve(3);

successfulPromise.then(function (value) {
  return 5; // oh no, we lose 3 at this step
}).then(function (value) {
  return value * value;
}).then(console.log); // throwback
```

What happens here? We chain two thens off of a promise that will resolve successfully.  Each one, when it returns, passes the return value into the next one.  Neat.  

That means the first `then` takes in 3 as value, but returns 5.  The next `then` takes in 5 as the value (from the previous return) and returns 25. Finally, the last `then` takes in 25 as the value and logs it out.

#### Back to the main mission

```js
  return fetchPostComments(post.id).then(function (comments) {
    // #2: Something goes here
  });
```

We are wondering what to put in the `.then` here.  We really want the `post` to come back, so we could return it.

```js
  return fetchPostComments(post.id).then(function (comments) {
    return post;
  });
```

Which means later when we then off of `setCommentsOnPost()` we can recover the post object.  But this isn't quite enough!

Before returning the post, in one line beforehand... store the incoming comments inside the post object, by assigning it to `post.comments`.  Then when we return the `post`, it has the comments inside.

#### Number 1, the new Number 2

Now how to we handle the case when we've previously fetched?  We can return a rejected promise very easily:

```js
  if (post.comments) {
    // #1: Something goes here
  }
```

Inside that `if` block, let's return a rejected promise.  The easy way to do this is simply to use `Promise.reject()` to create a promise that will reject.  Return it, and maybe pass in `null` as the argument to `.reject` to return something.

Now when we `.catch` off of `setCommentsOnPost`, we will have something to catch.

#### Test it

Save and paste this into your console to test out `setCommentsOnPost`:

```js
let fakePost = { id: 1 }

setCommentsOnPost(fakePost)
  .then(console.log)
  .catch(console.error) // should show the post with comments
```

Then, after the logged post with comments, call it again the last command a second time.  This time you should have a `null` error logged to the console.

Very cool stuff, programmer.  We've done the hardest part first, the rest is a coast back down to bottom.

### Rendering Posts

Here's a shell:

```js
function renderPost(post) {

}

function renderPostList(postList) {

}
```

#### `renderPost`

And here is your template for a single post:

```html
<div class="post-card">
  <header>
    <h3>sunt aut facere repellat provident occaecati excepturi optio reprehenderit</h3>
    <h3>--- Bret</h3>
  </header>
  <p>quia et suscipit
suscipit recusandae consequuntur expedita et cum
reprehenderit molestiae ut ut quas totam
nostrum rerum est autem sunt rem eveniet architecto</p>
  <footer>
    <div class="comment-list"></div>
    <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
  </footer>
</div>
```

You'll have to use the title, the user's username, and the body from the `post` object.

You should also attach the `post` object to the element being returned from `renderPost`.

#### `renderPostList`

And just like with `renderAlbumList`, we should remove the active class from the current active section.  Then empty the `#post-list` and add the active class to it.

Loop over the `postList` and append the returns from `renderPost` into `#post-list`.

### Showing/hiding Comments

Here's an early birthday present:

```js
function toggleComments(postCardElement) {
  const footerElement = postCardElement.find('footer');

  if (footerElement.hasClass('comments-open')) {
    footerElement.removeClass('comments-open');
    footerElement.find('.verb').text('show');
  } else {
    footerElement.addClass('comments-open');
    footerElement.find('.verb').text('hide');
  }
}
```

When we use it, we are going to pass in the relevant `#post-card` element so that we can add/remove classes, and update the text to/from show and hide.

### The One True Click Handler

This is the final leg of our ride, so let's get to it.  We need to attach a click handler for users clicking on the `.toggle-comments`:

```js
$('#post-list').on('click', '.post-card .toggle-comments', function () {
  const postCardElement = $(this).closest('.post-card');
  const post = postCardElement.data('post');

  setCommentsOnPost(post)
    .then(function (post) {
      console.log('building comments for the first time...', post);
    })
    .catch(function () {
      console.log('comments previously existed, only toggling...', post);
    });
});
```

Here's the shell of the function.  Click on "Show Posts" for a user, then click on "Show Comments" on one of their posts.

What happens? Nothing in the interface. How about the console? Something should happen. What was it?

Click again. What happened this time? Keep clicking. Does `setCommentsOnPost` work the way we hope?

Good.

#### `.then`

For the then, we've just attached `.comments` to our post for the first time ever.  So let's render them into the `.comment-list`.  

Now, you can't just do this to any `.comment-list`, but the one inside our specific `postCardElement`. Lucky for you, the `.find()` method makes getting the right one easy.

First, just in case, empty it.  Then, looping over the `post.comments`, append an `<h3>` tag with the `comment.body` and the `comment.email` as the text.

Finally, call `toggleComments` on the `postCardElement`.

#### `.catch`

Here, the assumption is we've previously attached the comments to the `post`, and thus we must've previously also appended their rendering into the `.comment-list`.  This means any time we are in the catch, we simply need to call `toggleComments` on the `postCardElement`.

### That's it!

You've done it.  You've build a number of AJAX calls, you've built out an app with data outside of your control, and you've done a lot of neat little things along the way.

I'm proud of you.

Really really.
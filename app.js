const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';

/* Helper function for fetch */
function fetchData(url) {
  return fetch(url).then(function (res) {
    return res.json();
  }).catch(function (err) {
    console.error(err);
  });
}

/* Specific fetch functions for our app */
function fetchUsers() {
  return fetchData(`${ BASE_URL }/users`);
}

function fetchUserPosts(userId) {
  return fetchData(`${ BASE_URL }/users/${ userId }/posts?_expand=user`);
}

function fetchPostComments(postId) {
  return fetchData(`${ BASE_URL }/posts/${ postId }/comments`);
}

function fetchUserAlbumList(userId) {
  return fetchData(`${ BASE_URL }/users/${ userId }/albums?_expand=user&_embed=photos`);
}

/* Utility Function */
function setCommentsOnPost(post) {
  // if we already have comments, don't fetch them again
  if (post.comments) {
    return Promise.reject(null);
  }

  // fetch, upgrade the post object, then return it
  return fetchPostComments(post.id).then(function (comments) {
    post.comments = comments;
    return post;
  });
}

/* Render Functions */
/* Single User Card */
function renderUser(user) {
  return $(`<div class="user-card">
    <header>
      <h2>${ user.name }</h2>
    </header>
    <section class="company-info">
      <p><b>Contact:</b> ${ user.email }</p>
      <p><b>Works for:</b> ${ user.company.name }</b></p>
      <p><b>Company creed:</b> "${ user.company.catchPhrase }, which will ${ user.company.bs }!"</p>
    </section>
    <footer>
      <button class="load-posts">POSTS BY ${ user.username }</button>
      <button class="load-albums">ALBUMS BY ${ user.username }</button>
    </footer>
  </div>`).data('user', user);
}

/* All Users */
function renderUserList(userList) {
  const userListElement = $('#user-list');
  userListElement.empty();
  
  userList.forEach(function (user) {
    userListElement.append( renderUser(user) );
  });
}

/* One Post */
function renderPost(post) {
  return $(`<div class="post-card">
    <header>
      <h3>${ post.title }</h3>
      <h3>--- ${ post.user.username }</h3>
    </header>
    <p>${ post.body }</p>
    <footer>
      <div class="comment-list"></div>
      <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
    </footer>
  </div>`).data('post', post)
}

/* All Posts */
function renderPostList(postList) {
  $('#app section.active').removeClass('active');

  const postListElement = $('#post-list');
  postListElement.empty().addClass('active');

  postList.forEach(function (post) {
    postListElement.append( renderPost(post) );
  });
}

/* One Album */
function renderAlbum(album) {
  const albumElement = $(`<div class="album-card">
    <header>
      <h3>${ album.title }, by ${ album.user.username } </h3>
    </header>
    <section class="photo-list"></section>
  </div>`);

  const photoListElement = albumElement.find('.photo-list');

  album.photos.forEach(function (photo) {
    photoListElement.append( renderPhoto(photo) );
  });

  return albumElement;
}

function renderPhoto(photo) {
  return $(`<div class="photo-card">
    <a href="${ photo.url }" target="_blank">
      <img src="${ photo.thumbnailUrl }" />
      <figure>${ photo.title }</figure>
    </a>
  </div>`);
}

/* All Albums */
function renderAlbumList(albumList) {
  $('#app section.active').removeClass('active');

  const albumListElement = $('#album-list');
  albumListElement.empty().addClass('active');

  albumList.forEach(function (album) {
    albumListElement.append( renderAlbum(album) );
  });  
}

/* Interface Utilities */
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

/* Interactions */
/* Sections */
$('#user-list').on('click', '.user-card .load-posts', function () {
  const user = $(this).closest('.user-card').data('user');

  fetchUserPosts(user.id)
    .then(renderPostList);
});

$('#user-list').on('click', '.user-card .load-albums', function () {
  const user = $(this).closest('.user-card').data('user');

  fetchUserAlbumList(user.id)
    .then(renderAlbumList);
});

$('#post-list').on('click', '.post-card .toggle-comments', function () {
  const postCardElement = $(this).closest('.post-card');
  const post = postCardElement.data('post');
  const commentListElement = postCardElement.find('.comment-list');

  setCommentsOnPost(post)
    .then(function (post) {
      console.log('building comments for the first time...')
      
      commentListElement.empty();
      post.comments.forEach(function (comment) {
        commentListElement.prepend($(`
          <h3>${ comment.body } --- ${ comment.email }</h3>
        `));
      });
      toggleComments(postCardElement);
    })
    .catch(function () {
      console.log('comments previously existed, only toggling...')
      
      toggleComments(postCardElement);
    });
});

/* Starting up application */
function bootstrap() {
  fetchUsers().then(renderUserList);
}

bootstrap();

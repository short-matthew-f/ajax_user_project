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
  return fetchData(`${ BASE_URL }/users/${ userId }/posts?_embed=comments&_expand=user`);
}

function fetchUserAlbums(userId) {
  return fetchData(`${ BASE_URL }/users/${ userId }/albums?_embed=photos&_expand=user`);
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
      <a href="#" class="toggle-comments">(<span class="verb">show</span> ${ post.comments.length } comments)</a>
    </footer>
  </div>`).data('post', post)
}

/* All Posts */
function renderPostList(postList) {
  $('#app section').removeClass('active');

  const postListElement = $('#post-list');
  postListElement.empty().addClass('active');

  postList.forEach(function (post) {
    postListElement.append( renderPost(post) );
  });
}

/* One Album */
function renderAlbum(album) {
  let albumElement = $(`<div class="album-card">
    <header>
      <h3>${ album.title }, by ${ album.user.username } </h3>
    </header>
    <section class="photo-list"></section>
  </div>`).data('album', album);

  album.photos.forEach(function (photo) {
    albumElement.find('.photo-list').append( renderPhoto(photo) );
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
  $('#app section').removeClass('active');

  const albumListElement = $('#album-list');
  albumListElement.empty().addClass('active');

  albumList.forEach(function (album) {
    albumListElement.append( renderAlbum(album) );
  });  
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

  fetchUserAlbums(user.id)
    .then(renderAlbumList);
});

$('#post-list').on('click', '.post-card .toggle-comments', function () {
  const post = $(this).closest('.post-card').data('post');
  const footer = $(this).closest('footer');
  const commentListElement = footer.find('.comment-list');

  if (footer.hasClass('comments-open')) {
    commentListElement.empty();
    footer.removeClass('comments-open');
    footer.find('.verb').text('show');
  } else {
    footer.addClass('comments-open');
    footer.find('.verb').text('hide');
    

    post.comments.forEach(function (comment) {
      const commentEl = $('<h3>').text(
        `${ comment.body } --- ${ comment.email }`
      );
      commentListElement.prepend( commentEl );
    });
  }
})

/* Starting up application */
function bootstrap() {
  fetchUsers().then(function (users) {
    renderUserList(users)
  });
}

bootstrap();

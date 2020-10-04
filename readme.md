RESTFUL ROUTES 

name            url             verb        desc    
====================================================================
INDEX           ./blogs         GET        Display main list of posts
NEW             /blogs/new      GET        Display form to create new post  
CREATE          /blogs          POST       Add new post
SHOW            /blogs/:id      GET        Shows info about one post


INDEX           /campgrounds
NEW             /campgrounds/:id/comments/new
CREATE          /campgrounds/:id/comments
SHOW            /campgrounds/:id
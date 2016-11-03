import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

function PostListItem(props) {
  return (
    <div>
      <Link to={`/paths/${props.post.cuid}`} >
        <p>{props.post.textContent}</p>
      </Link>
      <p><a href='#' onClick={props.onDelete}><FormattedMessage id='deletePost' /></a></p>
      <hr />
    </div>
  );
}

PostListItem.propTypes = {
  post: PropTypes.shape({
    content: PropTypes.object.isRequired,
    htmlContent: PropTypes.string.isRequired,
    textContent: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PostListItem;

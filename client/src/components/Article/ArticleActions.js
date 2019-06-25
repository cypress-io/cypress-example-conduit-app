import { Link } from 'react-router-dom'
import React from 'react'
import agent from '../../agent'
import { connect } from 'react-redux'
import { DELETE_ARTICLE } from '../../constants/actionTypes'

const mapDispatchToProps = dispatch => ({
  onClickDelete: payload => dispatch({ type: DELETE_ARTICLE, payload })
})

const ArticleActions = props => {
  const article = props.article
  const del = () => {
    props.onClickDelete(agent.Articles.del(article.slug))
  }
  if (props.canModify) {
    return (
      <span>
        <Link
          to={`/editor/${article.slug}`}
          className='btn btn-outline-secondary btn-sm'
          data-cy='edit-article'
        >
          <i className='ion-edit' /> Edit Article
        </Link>

        <button
          className='btn btn-outline-danger btn-sm'
          onClick={del}
          data-cy='delete-article'
        >
          <i className='ion-trash-a' /> Delete Article
        </button>
      </span>
    )
  }

  return <span />
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(ArticleActions)

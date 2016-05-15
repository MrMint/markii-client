import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { SONG_SEARCH_LIST_ITEM } from '../../../utilities/constants/dragTypes';
import MenuItem from 'material-ui/MenuItem';
import styles from './PlaylistListItem.css';
import SongNavItem from '../../SongNavItem';

class PlaylistListItem extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    songCount: React.PropTypes.number.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired,
    canAddSong: React.PropTypes.func.isRequired,
    onPlaylistListItemSelected: React.PropTypes.func.isRequired,
  };

  class = () => {
    const { isOver, canDrop } = this.props;
    if (canDrop) {
      if (isOver) {
        return styles.canDropIsOver;
      }
      return styles.canDrop;
    }
    if (isOver) {
      return styles.canNotDrop;
    }
  };

  handleOnClick = () => {
    const { id, onPlaylistListItemSelected } = this.props;
    onPlaylistListItemSelected(id);
  }

  render() {
    const { name, songCount, connectDropTarget } = this.props;
    return connectDropTarget(
      <div onClick={this.handleOnClick}>
        <SongNavItem className={this.class()} primaryText={name} rightBadge={songCount} />
      </div>
    );
  }
}

const playlistListItemTarget = {
  canDrop: (props, monitor) => {
    const { id } = props;
    const song = monitor.getItem();
    return props.canAddSong(song.source, song.sourceId, id);
  },
  drop: (props) => {
    return {
      id: props.id,
    };
  },
};

export default DropTarget(
  SONG_SEARCH_LIST_ITEM,
  playlistListItemTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)(PlaylistListItem);

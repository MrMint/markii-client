import { take, put, race, cancel, fork, join } from 'redux-saga';
import { SEARCH_MEDIA_REQUEST } from '../constants';
import { search as searchYoutubeApi } from '../../../utilities/api/youtubeApi';
import { receiveMediaResults, clearMediaSearchResults } from '../actions';

function* searchYoutube(query) {
  return yield searchYoutubeApi(query);
}

export function* songSearch() {
  let query;
  /* eslint-disable */
  while(true) {
  /* eslint-enable */

    // Wait for the user to execute a search
    // If query is defined, skip as we are dealing with a cancellation
    if (!query) {
      ({ payload: { query } } = yield take(SEARCH_MEDIA_REQUEST));
    }

    // Start search tasks asynchronously
    const searchYoutubeTask = yield fork(searchYoutube, query);
    const searchTasks = [
      searchYoutubeTask,
    ];

    // Wait for all search tasks to complete, or the user to start a new search
    const { results, search } = yield race({
      results: searchTasks.map(join),
      search: take(SEARCH_MEDIA_REQUEST),
    });

    // Dispatch the results or cancel search tasks and requery
    if (results) {
      yield put(clearMediaSearchResults());
      yield put(receiveMediaResults(results.concat.apply([], results)));
      query = undefined;
    } else {
      searchTasks.forEach(cancel);
      query = search.payload.query;
    }
  }
}

import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchMoviesHandler = useCallback(async () => {
		// fetch('https://swapi.dev/api/films')
		// 	.then((response) => {
		// 		return response.json();
		// 	})
		// 	.then((data) => {
		// 		setMovies(data.results);
		// 	});
		//==========강의와는 달리 async, await 사용==========
		setIsLoading(true);
		setError(null); //에러 초기화
		try {
			//fetch default {method : get}
			const response = await fetch('https://react-practice-fetch-movies-default-rtdb.firebaseio.com/movies.json');
			//error 처리 && status에 대한 처리도 필요함
			if (!response.ok && response.status !== 200) {
				throw new Error('Something went wrong!');
			}

			const data = await response.json();
			const loadedMovies = [];

			for (const key in data) {
				loadedMovies.push({
					id: key,
					title: data[key].title,
					openingText: data[key].openingText,
					releaseDate: data[key].releaseDate,
				});
			}

			setMovies(loadedMovies);
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
	}, []);

	//의존성 배열에 빈배열 -> 컴포넌트가 최초로 로딩될 때에만 실행
	//빈배열을 넣어도 문제가 없지만, effect 함수 내에서 사용하는 모든 의존성을 의존성 배열에 추가하는 것이 BEST!
	//의존성 배열에 fetchMoviesHandler 함수 포인터 추가 -> 이 함수가 변경되면 재실행되도록함(외부상태를 이용하여 바꿀 수도 있으니..)
	//다만, 함수는 객체기 때문에 컴포넌트가 재랜더링될때마다 변경됨 -> 무한루프 발생할 수 있음 -> useCallback으로 감싸줘야 함!
	useEffect(() => {
		fetchMoviesHandler();
	}, [fetchMoviesHandler]);

	async function addMovieHandler(movie) {
		const response = await fetch('https://react-practice-fetch-movies-default-rtdb.firebaseio.com/movies.json', {
			method: 'POST',
			body: JSON.stringify(movie),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		fetchMoviesHandler();
	}

	let content = <p>Found no movies.</p>;

	if (movies.length > 0) {
		content = <MoviesList movies={movies} />;
	}
	if (error) {
		content = <p>{error}</p>;
	}

	if (isLoading) {
		content = <p>Loading...</p>;
	}

	return (
		<React.Fragment>
			<section>
				<AddMovie onAddMovie={addMovieHandler} />
			</section>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>
				{/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
				{!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
				{!isLoading && error && <p>{error}</p>}
				{isLoading && <p>Loading...</p>} */}
				{content}
			</section>
		</React.Fragment>
	);
}

export default App;

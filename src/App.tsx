import * as React from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import './App.css';

const URL = 'https://hn.algolia.com/api/v1/search?query=';

function App() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [hits, setHits] = React.useState([])

  const handleFetchStories = async () => {
    try {
        const result = await axios.get(URL);
        setHits(result.data.hits)
    } catch (error) {
        console.log('fetch error', error)
    }
  }

  React.useEffect(() => {
    handleFetchStories()
  }, [])

  const handleSearchSubmit = (e: any) => {
    e.preventDefault()
    console.log('handleSearchSubmit', searchTerm)
  }

  const handleSearchReset = (e: any) => {
    e.preventDefault()
    setSearchTerm('')
  }
  
  const handleSearchChange = ( e: any ) => {
    console.log('handleSearchChange', e.target.value)
    setSearchTerm(e.target.value)
  }

  return (
    <div className="App">
      <h3>App</h3>
      <SearchForm searchTerm={searchTerm}   
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        handleSearchReset={handleSearchReset}
      />

      <List hits={hits}
      />
    </div>
  );
}

const SearchForm = ( props: any ) => {
  const {searchTerm, handleSearchChange, handleSearchSubmit, handleSearchReset} = props

  return (
    
    <>
      <h4>Search Form</h4>
      <form onSubmit={ handleSearchSubmit } onReset={ handleSearchReset }
      >
       
        <Input searchTerm = {searchTerm} onSearchChange={handleSearchChange}
        />
        <button type='submit' onSubmit={handleSearchSubmit}>Submit</button>
        <button type='reset' onReset={handleSearchReset}>Reset</button>
      </form>
    </>
  )
}

const Input = (props: any) => {
  const { searchTerm } = props
  const {onSearchChange } = props

  return (
    <>
      <h5>Input</h5>
      <label htmlFor='searchTerm'>Search: </label>
      <input type='text' id='searchTerm' name='searchTerm' 
        value={searchTerm}
        onChange={onSearchChange}
        autoFocus
      />
    </>
  )
}

interface IHit {
  title: string,
  author: string,
  num_comments: number,
  point: number
}

const List = (props: any) => {
  const { hits } = props
  const [sortedList, setSortedList] = React.useState<IHit[]>(hits)
 
  React.useEffect(() => {
    setSortedList(sortBy(hits, 'title'))
  }, [hits])

  const handleSort = (sortKey: string) => {
    setSortedList(sortBy(hits, sortKey))
  };

  // console.log('sortedList', sortedList)

  return (
    <>
      <table>
        <thead>
          <tr>
            <th colSpan={4}>Hits</th>
          </tr>
          <tr>
            <th>
              <button type="button" onClick={() => handleSort('title')}>
                Title
              </button>
            </th>
            <th>
              <button type="button" onClick={() => handleSort('author')}>
                Author
              </button>
            </th> 
            <th>
              <button type="button" onClick={() => handleSort('num_comments')}>
                Number of Comments
              </button>
            </th>
            <th>
              <button type="button" onClick={() => handleSort('points')}>
                Points
              </button>
            </th>
          </tr>

        </thead>
        <tbody>
          {
            sortedList.map((el: any, i: number) => (
              <tr key={i}>
                  <Item el={el} />
              </tr>
            
            ))
          }
        </tbody>
      </table>
    </>
  )
}

const Item = (props: any) => {
  const { el } = props
 
  return (
    <>
      <td>{el['title']} </td>
      <td>{el['author']} </td>
      <td>{el['num_comments']}</td>
      <td>{el['points']} </td>
    </>
  )
}

export default App;

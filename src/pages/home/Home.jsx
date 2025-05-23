import React from 'react'
import Banner from '../../components/Banner'
import Categories from './Categories'
import SpecialsDishes from './SpecialsDishes'
import Testimonials from './Testimonials'
import OurServices from './OurServices'
import FilteredMenu from '../shop/FilteredMenu'
import FilteredAccessoriesAndTV from '../shop/FilteredAccessoriesAndTV'
import Map from './Map'


const Home = () => {
  return (
    <div className='mt-10'>
      <Banner/>
      <FilteredMenu />
      <Categories/>
      <FilteredAccessoriesAndTV />
      <SpecialsDishes/>
      <Testimonials/>
      <OurServices/>
      <Map />
    </div>
  )
}

export default Home

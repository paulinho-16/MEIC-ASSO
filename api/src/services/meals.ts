import fetch from 'node-fetch'
import constants from '@/config/constants'

import {
  Meal,
  MealInformation,
  MealInformationRaw,
  MealRaw,
  Menu,
  MenuRaw,
} from '@/@types/meals'

function parseMeals(meals: MealRaw[]): Meal[] {
  return meals.map(meal => {
    const { estado: state, tipo_descr: type, descricao: description } = meal

    return {
      state,
      description,
      type,
    }
  })
}

function parseMenus(menus: MenuRaw[]): Menu[] {
  return menus.map(menu => {
    const { estado: state, data: date, pratos: mealsRaw } = menu

    return {
      state,
      date,
      meals: parseMeals(mealsRaw),
    }
  })
}

function parseMealsInformation(meals: MealInformationRaw): MealInformation {
  return meals.map(meal => {
    const {
      codigo: code,
      descricao: description,
      horario: scheduleRaw,
      ementas: menusRaw,
    } = meal

    const schedule = {
      start: scheduleRaw.split('às')[0].trim(),
      end: scheduleRaw.split('às')[1]?.trim() || undefined,
    }

    return {
      code,
      description,
      schedule,
      menus: parseMenus(menusRaw),
    }
  })
}

async function fetchMealsData(restaurantCode: number[]) {
  const response = await fetch(constants.canteenUrl)

  try {
    const data = await response.json()

    const restaurant = data.filter((r: { codigo: number }) => restaurantCode.includes(r.codigo))

    return parseMealsInformation(restaurant)
  } catch {
    throw new Error(`CanteenURL responded with status ${response.status}`)
  }
}

export default {
  fetchMealsData,
}

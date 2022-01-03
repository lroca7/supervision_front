import { groupBy } from "../../utility/Utils"

export const buildData = (data, grupo) => {
    const group = data.reduce((r, item) => {
      r[item.subgrupo] = [...(r[item.subgrupo] || []), item]

      if (item.key === 'confIndices') {

        const splitOne =  item.valor.split('/')
        const valuesInArray = []
        splitOne.forEach(element => {
          const splitTwo = element.split(':')
          const grupos = splitTwo[2].split(' ')
          const elementos = []
          grupos.forEach((grupo, key) => {
            const obj = {
              id:  `${grupo}_${splitTwo[0]}_${splitTwo[1]}`,
              nombre: splitTwo[0],
              rango: splitTwo[1],
              grupo
            }
            valuesInArray.push(obj)
          })
          
        })

        r[item.subgrupo][0]['valuesInArray'] = valuesInArray
      }
      
      if (grupo !== 'Monitoreo RV') { 
        if (item.key ===  'porAjustadorLim_SP' || item.key === 'porAjustadorLim_BL') {
          
          const itemValor = item.valor
          const splitOneSP =  itemValor.split('/')
          const valuesInArrayMonitoreo = []

          splitOneSP.forEach(element => {
            
            const splitTwoSP = element.split(':')
            const grupos = splitTwoSP[2]?.split(' ')
                  
            if (grupos !== undefined) {
              grupos.forEach((grupo, key) => {
              
                const sGrupo = grupo.split('(')
                const nGrupo = sGrupo[0]
                
                
                const obj = {
                  id:  `${grupo}_${splitTwoSP[0]}_${splitTwoSP[1]}`,
                  nombre: splitTwoSP[0],
                  rango: splitTwoSP[1],
                  grupo: nGrupo
                }
    
                if (sGrupo[1] !== undefined) {
                  const gPorcentaje = sGrupo[1].replace(')', '')
                  obj.porcentaje = gPorcentaje
                }
    
                valuesInArrayMonitoreo.push(obj)
              })
            }          
            
          })

          const indexGroup = r[item.subgrupo].findIndex(x => x.key === item.key)

          r[item.subgrupo][indexGroup]['valuesInArray'] = valuesInArrayMonitoreo
          
        }
      }

      return r
    }, {})
    console.log("subgrupos -> ", group)
    
    return group
}

export const getValues = (itemSelected) => {
    
    const itemChanged = itemSelected

    if (itemSelected.valuesInArray !== undefined) {
  
      const corto = itemSelected.valuesInArray.filter(f => {
        return f.nombre === 'corto'
      })
      const largo = itemSelected.valuesInArray.filter(f => {
        return f.nombre === 'largo'
      })
      const mediano = itemSelected.valuesInArray.filter(f => {
        return f.nombre === 'mediano'
      })
     
      const cortos = groupBy(corto, "rango")
      const c = Object.keys(cortos).length
      
      const largos = groupBy(largo, "rango")
      const l = Object.keys(largos).length
  
      const medianos = groupBy(mediano, "rango")
      const m = Object.keys(medianos).length
  
      let valoresCorto = ''
      let valoresLargo = ''
      let valoresMediano = ''
      
      Object.entries(cortos).forEach(([key, value], kk) => {
        //corto:0-1095:MH_DOP MH_USD BC_DOP CORP_DOP CORP_USD/
        let stringCortos = ''
  
        if (kk < c - 1) {
          stringCortos = `corto:${key}:`
        } else {
          stringCortos = `/corto:${key}:`
        }     
        
        value.forEach((element, k) => {
          
          if (k === 0) {
            
            if (element.porcentaje) {
              stringCortos += `${element.grupo}(${element.porcentaje})`
            } else {
              stringCortos += `${element.grupo}`
            }
          } else {
            if (element.porcentaje) {
              stringCortos += ` ${element.grupo}(${element.porcentaje})`
            } else {
              stringCortos += ` ${element.grupo}`
            }            
          }
         
        })
        
        valoresCorto += stringCortos
      })
  
      Object.entries(largos).forEach(([key, value], kk) => {        
        
        let stringLargos = ''
  
        if (kk < l - 1) {
          stringLargos = `largo:${key}:`
        } else {
          stringLargos = `/largo:${key}:`
        }     
        
        value.forEach((element, k) => {
          
          if (k === 0) {
            stringLargos += `${element.grupo}`
          } else {
            stringLargos += ` ${element.grupo}`
          }
        })
        
        valoresLargo += stringLargos
      })
  
      Object.entries(medianos).forEach(([key, value], kk) => {        
        
        let stringMedianos = ''
  
        if (kk < m - 1) {
          stringMedianos = `mediano:${key}:`
        } else {
          stringMedianos = `/mediano:${key}:`
        }     
        
        value.forEach((element, k) => {
          if (k === 0) {
            stringMedianos += `${element.grupo}`
          } else {
            stringMedianos += ` ${element.grupo}`
          }
        })
        
        valoresMediano += stringMedianos
      })
  
      let valoresAll = `${valoresCorto}/${valoresMediano}/${valoresLargo}`
      valoresAll = valoresAll.replaceAll('//', '/')
      if (valoresAll.charAt(0) === '/') {
        valoresAll = valoresAll.slice(1)
      }
      itemChanged.valor = valoresAll
      // setItemSelected(itemChanged)

    } else {
      const input = document.getElementById(itemSelected.key)
      if (input !== null) {
        if (input.value !== '') {
          itemChanged.valor = input.value
          // setItemSelected(itemChanged)
        }
      }      
    }

    if (itemChanged.valor.charAt(0) === '/') {
      itemChanged.valor = itemChanged.valor.slice(1)
    }
    if (itemChanged.valor.charAt(itemChanged.valor.length - 1) === '/') {
      itemChanged.valor = itemChanged.valor.slice(0, -1)
    }

    itemChanged.valor = itemChanged.valor.replaceAll('//', '/')

    return itemChanged

}
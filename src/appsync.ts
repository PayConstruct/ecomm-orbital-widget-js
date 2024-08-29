import { util } from '@aws-appsync/utils'

/**
 * Compose an equality filter expression for a DynamoDB query or scan operation. Supports nested attributes.
 * @param filterFieldsValuesMap a map of attribute names and their values from your DynamoDB table
 * @returns an object with the expression, expressionValues, and expressionNames in the format required by DynamoDB
 */
export function composeFilterExpression(filterFieldsValuesMap: { [key: string]: any }) {
  const fieldNames = Object.keys(filterFieldsValuesMap)
  if (fieldNames.length === 0) return null
  const fieldValues = Object.values(filterFieldsValuesMap)
  let expression = ''
  let expressionNames = {}
  let rawExpressionValues = {}
  const fieldValuesLength = fieldValues.length - 1
  fieldNames.forEach((fieldName, i) => {
    if (filterFieldsValuesMap[fieldName] || typeof filterFieldsValuesMap[fieldName] === 'boolean') {
      let escapedFieldName = ''
      fieldName
        .split('')
        .filter(char => char !== '.')
        .forEach(char => (escapedFieldName += char))
      const isDynamoMap = !!(fieldName.split('').filter(char => char === '.').length > 0)
      if (!isDynamoMap) {
        if (typeof filterFieldsValuesMap[fieldName] === 'object') {
          expression += `#${fieldName} IN (${filterFieldsValuesMap[fieldName]
            .map((_values: any, index: number) => `:${fieldName}${index}`)
            .join(', ')})`
        } else {
          expression += `#${fieldName} = :${fieldName}`
        }
        expressionNames = { ...expressionNames, [`#${fieldName}`]: fieldName }
      } else {
        expression += `${fieldName} = :${escapedFieldName}`
      }
      if (i < fieldValuesLength) expression += ' AND '
      if (typeof filterFieldsValuesMap[fieldName] === 'object') {
        filterFieldsValuesMap[fieldName].forEach((value: any, index: number) => {
          rawExpressionValues = { ...rawExpressionValues, [`:${fieldName}${index}`]: value }
        })
      } else {
        rawExpressionValues = { ...rawExpressionValues, [`:${escapedFieldName}`]: filterFieldsValuesMap[fieldName] }
      }
    }
  })
  return {
    expression,
    expressionValues: util.dynamodb.toMapValues(rawExpressionValues),
    ...(Object.keys(expressionNames).length ? { expressionNames } : {}),
  }
}

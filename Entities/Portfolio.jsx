{
  "name": "Portfolio",
  "type": "object",
  "properties": {
    "coin_id": {
      "type": "string"
    },
    "coin_name": {
      "type": "string"
    },
    "coin_symbol": {
      "type": "string"
    },
    "coin_image": {
      "type": "string"
    },
    "quantity": {
      "type": "number"
    },
    "buy_price": {
      "type": "number"
    },
    "buy_date": {
      "type": "string",
      "format": "date"
    },
    "transaction_type": {
      "type": "string",
      "enum": [
        "buy",
        "sell"
      ]
    }
  },
  "required": [
    "coin_id",
    "coin_name",
    "quantity",
    "buy_price"
  ]
}
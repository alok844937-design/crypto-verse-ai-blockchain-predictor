{
  "name": "Watchlist",
  "type": "object",
  "properties": {
    "coin_id": {
      "type": "string",
      "description": "CoinGecko coin ID"
    },
    "coin_name": {
      "type": "string"
    },
    "coin_symbol": {
      "type": "string"
    },
    "coin_image": {
      "type": "string"
    }
  },
  "required": [
    "coin_id",
    "coin_name",
    "coin_symbol"
  ]
}
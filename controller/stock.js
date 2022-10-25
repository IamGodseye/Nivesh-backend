import ExchangeRates from '../models/exchangeRates.js';

import { MatchingEngine, OrderSide } from 'exchange-macthing-engine';
import User from '../models/user.js';
import Wallet from '../models/wallet.js';
import AssetTransactions from '../models/assetTransactions.js';
const matchingEngine = new MatchingEngine();


const currencyPrice = async (symbol) => {
    const [lastUpdatedData] = await ExchangeRates.find({}).sort({ _id: -1 }).limit(1);
    const lastUpdatedPrice = lastUpdatedData["data"]["rates"]
    return lastUpdatedPrice[symbol]
}

const userAccountBalance = async (id) => {
    const { walletId } = await User.findById(id).select("walletId")

    const { balance } = await Wallet.findById(walletId).select("balance")
    return balance

}

export const buyCrypto = async (req, res) => {
    try {
        const id = req.user._id
        const { currency, amount } = req.body
        const balance = await userAccountBalance(id)
        console.log({ amount, balance })
        if (parseFloat(amount) > parseFloat(balance)) throw Error('Insufficient balance')
        const currentCurrencyPrice = await currencyPrice(currency);
        const currencyUnit = amount / currentCurrencyPrice

        const orderResponse = matchingEngine.newOrder(currency, currentCurrencyPrice, currencyUnit, OrderSide.buy);
        const order = orderResponse.data.order;
        const trades = orderResponse.data.trades
        const buyOrder = new AssetTransactions({ typeOf: 'BUY', userId: id, status: 'TXN_INIT', order })
        const orderBook = matchingEngine.orderBooks[currency]
        await buyOrder.save()

        return res.json({ orderBook, orderResponse, order, buyOrder, trades })
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}


export const sellCrypto = async (req, res) => {
    try {
        const id = req.user._id
        const { currency, amount } = req.body
        const balance = await userAccountBalance(id)
        // if (amount > balance) throw Error('Insufficient balance')
        const currentCurrencyPrice = await currencyPrice(currency);
        const currencyUnit = amount / currentCurrencyPrice

        const orderResponse = matchingEngine.newOrder(currency, currentCurrencyPrice, currencyUnit, OrderSide.sell);
        const order = orderResponse.data.order;
        const trades = orderResponse.data.trades
        const sellOrder = new AssetTransactions({ typeOf: 'SELL', userId: id, status: 'TXN_INIT', order })
        await sellOrder.save()

        return res.json({ orderResponse, order, sellOrder, trades })
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const orderData = async (req, res) => {
    try {
        const id = req.user._id
        const { currency, orderId } = req.body
        const exchangeOrderData = await AssetTransactions.findById(orderId)
        const { order } = exchangeOrderData
        const exchangeOrderId = order.orderId
        console.log(order[orderId])
        const data = matchingEngine.orderBooks[currency]
        const orderData = data.orderIdMap
        const orderDataById = orderData[exchangeOrderId]
        console.log({ order })
        console.log({ orderDataById })

        if (orderDataById.leavesQty != 0) {
            await AssetTransactions.findByIdAndUpdate(orderId, {
                order: orderDataById,
                status: 'TXN_PROCESSING',
            })
        }
        if (orderDataById.leavesQty === 0 && order.cumQty !== order.qty) {
            await AssetTransactions.findByIdAndUpdate(orderId, {
                order: orderDataById,
                status: 'TXN_COMPLETED',
            })
        }
        return res.json({ orderDataById })

    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}
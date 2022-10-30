import User from "../models/user.js"
import LoanTransactions from "../models/loanTransaction.js";
import { MatchingEngine, OrderSide } from 'exchange-macthing-engine';

const matchingEngine = new MatchingEngine();

export const makeBuisness = async (req, res) => {
    try {
        const id = req.user._id
        const userData = await User.findByIdAndUpdate(id,
            {
                $push: {
                    role: "Buisness"
                }
            })
        return res.json(userData)
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const buySample = async (req, res) => {
    try {
        const id = req.user._id
        const currency = 'LOAN'
        const { amount } = req.body
        // CREDIT SCORE will decide if candidate is credit-worthy or not
        const canGive = true

        if (!canGive) throw Error('Insufficient credit score')
        const orderResponse = matchingEngine.newOrder(currency, 1, amount, OrderSide.buy);
        const order = orderResponse.data.order;
        const trades = orderResponse.data.trades
        const loanRequestOrder = new LoanTransactions({ typeOf: 'LOAN_REQUEST', userId: id, status: 'TXN_INIT', order })
        const orderBook = matchingEngine.orderBooks[currency]
        await loanRequestOrder.save()

        return res.json({ orderBook, orderResponse, order, trades, loanRequestOrder })
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}



export const sellSample = async (req, res) => {
    try {
        const id = req.user._id
        const currency = 'LOAN'
        const { amount } = req.body
        // CREDIT SCORE will decide if candidate is credit-worthy or not
        // const canGive = true

        // if (!canGive) throw Error('Insufficient credit score')
        const orderResponse = matchingEngine.newOrder(currency, 1, amount, OrderSide.sell);
        const order = orderResponse.data.order;
        const trades = orderResponse.data.trades
        const loanInvestOrder = new LoanTransactions({ typeOf: 'LOAN_INVEST', userId: id, status: 'TXN_INIT', order })
        const orderBook = matchingEngine.orderBooks[currency]
        await loanInvestOrder.save()

        return res.json({ orderBook, orderResponse, order, trades, loanInvestOrder })
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}
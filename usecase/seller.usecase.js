class SellerUseCase {
    constructor(sellerRepository, redis) {
        this.sellerRepository = sellerRepository;
        this.cache = redis;
    }

    async registerSeller(data) {
        const seller = new Seller(data);
        await this.#setSellerWithPipeline(id, data);
        return await this.sellerRepository.createSeller(seller);
    }

    async getSeller(id) {
        const seller = await this.cache.hget(`seller:${id}`);
        if (seller) {
            return JSON.parse(seller);
        }
        await this.#setSellerWithPipeline(id, seller);
        return await this.sellerRepository.getSellerById(id);
    }

    async getAllSellers() { 
        return await this.sellerRepository.getAllSellers();
     }

    async verifySeller(id) {
        const seller = await this.getSeller(id);
        if (!seller) throw new Error("Seller not found");
        seller.markAsVerified();
        await this.cache.hset(`seller:${id}`, JSON.stringify(seller));
        return await this.sellerRepository.updateSeller(seller);
    }

    async updateSeller(id, data) {
        const seller = await this.getSeller(id);
        if (!seller) throw new Error("Seller not found");

        Object.assign(seller, data);
        seller.updatedAt = new Date();

        const updatedSeller = await this.sellerRepository.updateSeller(seller);
        if (updatedSeller) {
            await this.#setSellerWithPipeline(id, updatedSeller);
        }
        return updatedSeller
    }

    async deleteSeller(id) {
        const seller = await this.getSeller(id);
        if (!seller) throw new Error("Seller not found");
        
        await this.cache.del(`seller:${id}`);
        seller.softDelete();
        return await this.sellerRepository.updateSeller(seller);
    }

    async #setSellerWithPipeline(id, data) {
        const pipeline = this.cache.pipeline();
        pipeline.hset(`seller:${id}`, JSON.stringify(data));
        pipeline.expire(`seller:${id}`, 600);
        await pipeline.exec();
    }
}

module.exports = SellerUseCase;

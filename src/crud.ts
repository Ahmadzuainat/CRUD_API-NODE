// استيراد مكتبة Express لإنشاء السيرفر
import express from 'express';
// استيراد مكتبة Mongoose للتعامل مع قاعدة البيانات MongoDB
import mongoose from 'mongoose';
// استيراد مكتبة dotenv لتحميل متغيرات البيئة من ملف .env
import dotenv from 'dotenv';
// تم استيراد error من console لكن هذا السطر غير مستخدم فعليًا
import { error } from 'console';
// استيراد موديل المنتج (Product)
import { Product } from '../models/product.model.js';

// تحميل متغيرات البيئة
dotenv.config(); // هذا السطر يجب أن يكون قبل استخدام process.env

// إنشاء تطبيق Express
const app = express();

// تفعيل استقبال JSON من الطلبات
app.use(express.json());

// قراءة رابط الاتصال بقاعدة البيانات من ملف البيئة
const uri = process.env.MONGODB_URI;

// الراوت الرئيسي فقط للترحيب أو اختبار السيرفر
app.get('/',  (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write('<h1>Hello from CRUD API</h1>');
  res.send(); // إرسال الرد للعميل
});


// [GET] جلب جميع المنتجات
app.get('/Api/Product', async (req, res) => {
  try {
    const product = await Product.find(); // جلب كل المنتجات من القاعدة
    res.status(200).json(product); // إرسالها كـ JSON
  } catch (error) {
  res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
}

});


// [GET] جلب منتج واحد باستخدام ID
app.get('/Api/Product/:id', async (req, res) => {
  try {
    const { id } = req.params; // استخراج id من الرابط
    const product = await Product.findById(id); // جلب المنتج من القاعدة
    res.status(200).json(product);
  } catch (eror) {
    res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
});


// [POST] إنشاء منتج جديد
app.post('/Api/Product', async (req, res) => {
  try {
    const product = await Product.create(req.body); // إنشاء منتج جديد من البيانات القادمة
    res.status(200).json(product); // إرسال المنتج المُنشأ
  } catch (error) {
  res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
}

});


// [PUT] تحديث منتج باستخدام ID
app.put('/Api/Product/:id', async (req, res) => {
  try {
    const { id } = req.params; // استخراج ID من الرابط

    const product = await Product.findByIdAndUpdate(id, req.body); // تحديث المنتج

    if (!product) {
      res.status(500).json({ message: "not found the id !" }); // إذا لم يتم إيجاد المنتج
    }

    const updatedproduct = await Product.findById(id); // (اختياري) جلب المنتج بعد التحديث
    res.status(200).json(product); // إرسال المنتج (هنا يرجع القديم غالبًا)
  } catch (error) {
  res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
}

});


// [DELETE] حذف منتج باستخدام ID
app.delete('/Api/Product/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id); // حذف المنتج

    if (!product) {
      res.status(500).json({ message: "not found the id !" });
    }

    const deleteproduct = Product.findById(id); // (هذا السطر غير ضروري، لأنه لا يُستخدم)
    res.json({ message: `The product that has id=${id} is delete` }); // إرسال رسالة تأكيد الحذف
  } catch (eror) {
    res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
});


// الاتصال بقاعدة البيانات وتشغيل السيرفر
if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables'); // في حال لم يُعرّف رابط الاتصال
} else {
  mongoose.connect(uri)
    .then(() => {
      console.log('connect'); // تم الاتصال بنجاح

      // بدء تشغيل السيرفر على البورت المحدد في البيئة
      app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}/`);
});
    })
    .catch((error) => {
      console.log(error); // طباعة أي خطأ في الاتصال
    });
}

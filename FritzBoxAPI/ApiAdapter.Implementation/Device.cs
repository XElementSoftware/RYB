﻿using XElement.RedYellowBlue.FritzBoxAPI.FritzBoxHttpAPI.v109;

namespace XElement.RedYellowBlue.FritzBoxAPI.ApiAdapter
{
#region not unit-tested
    internal class Device : IDevice
    {
        public Device( DeviceDTO initialValues )
        {
            this._ain = initialValues.Identifier;

            this.IsConnected = initialValues.Present == 1;
            this.IsASwitch = (initialValues.FunctionBitmask & Device.BIT_NO9) != 0;
            this.Manufacturer = initialValues.Manufacturer;
            this.Name = initialValues.Name;
            this.ProductName = initialValues.ProductName;
        }


        public bool /*IDevice.*/IsASwitch { get; private set; }


        public bool /*IDevice.*/IsConnected { get; private set; }


        //public bool /*IDevice.*/IsConnected()
        //{
        //    // TODO: Call service to get recent state
        //}


        public string /*IDevice.*/Manufacturer { get; private set; }


        public string /*IDevice.*/Name { get; private set; }


        public string /*IDevice.*/ProductName { get; private set; }


        private const int BIT_NO9 = 512;


        private string _ain;
    }
#endregion
}
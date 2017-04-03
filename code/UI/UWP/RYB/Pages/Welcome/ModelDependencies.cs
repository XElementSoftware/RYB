﻿using System.Composition;
using XElement.RedYellowBlue.UI.UWP.Model;

namespace XElement.RedYellowBlue.UI.UWP.Pages.Welcome
{
#region not unit-tested
    [Shared] [Export]
    internal class ModelDependencies
    {
        [Import]
        public IConfig Config { get; set; }
    }
#endregion
}